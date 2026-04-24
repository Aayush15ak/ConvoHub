import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"; 

// to-do: Users can only chat with people they manually added as contacts, so we need to implement add contact feature in future and then only show those contacts in contacts list and allow users to chat with only those contacts, for now we are allowing users to chat with anyone by showing all users in contacts list except their own account
export const getAllContacts = async (req, res) => {
    try{
        const LoggedInUserId = req.user.id;
        const Contacts = await User.find({ _id: { $ne: LoggedInUserId } }).select('-password'); //list of contacts other than my own account
        return res.status(200).json(Contacts);
    } catch (error) {
        console.error('Error in getAllContacts:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMessagesByUserId = async (req, res) => {
    try{
        const myId = req.user._id;
        const otherUserId = req.params.id;   //the person i talking to's id
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // sort messages by createdAt in ascending order
        return res.status(200).json(messages);
    }
    catch(error){
        console.error('Error in getMessagesByUserId:', error);
        return res.status(500).json({ message: 'Cannot fetch messages. Internal Server Error' });
    }
}

export const sendMessage = async (req, res) => {
    try{
        const {text,image} = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        if(!text && !image) {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }
        if(senderId.toString() === receiverId.toString()) {  // to.string() is used because (_id in mongodb)senderId and receiverId are of type ObjectId and we cannot compare them directly with === operator, we need to convert them to string first
            return res.status(400).json({ message: 'You cannot send a message to yourself' });
        }
        const recieverExists = await User.exists({_id: receiverId});
        if(!recieverExists){
            return res.status(404).json({ message: 'Receiver not found' });
        }

        let imageUrl = null;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        //to-do: send message in real time using socket.io if user in online instead of saving in database and then sending response

        await newMessage.save();
        return res.status(201).json(newMessage);

    } catch (error) {
        console.error('Error in sendMessage:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatPartnerIds = messages.map( msg => (
            msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId : msg.senderId
        ));

        const uniqueChatPartnerIds = [...new Set(chatPartnerIds)];
        const chatPartners = await User.find({ _id: { $in: uniqueChatPartnerIds } }).select('-password');

        return res.status(200).json(chatPartners);
    } catch (error) {
        console.error('Error in getChatPartners:', error);
        return res.status(500).json({ message: 'Could not fetch chat partners. Internal Server Error' });
    }
}