import { User } from "../models/user.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import { UserMessageUsers } from "../models/usermessageusers.js"

export async function createUser(req, res) {
    const { username, password, email } = req.body;
    let auxUser;

    auxUser = await User.findOne({ where: { username: username } });
    if(auxUser != null){
        return res.status(500);
    }

    try {
        let newUser = await User.create(
            {
                username,
                password,
                email
            }
        );
        return res.json(newUser);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    res.json("received");
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const user = await User.findByPk(id);
        user.username = username;
        user.email = email;
        await user.save();
        res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        user.active = false;
        await user.save();
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getUserFriends(req, res) {
    const { id } = req.params;

    try {
        const friends = await UserFriends.findAll({
            attributes: ["FriendId"],
            where: { UserId: id },
        });
        res.json(friends);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function getUserServers(req, res) {
    const { id } = req.params;

    try {
        const servers = await UserServers.findAll({
            attributes: ["ServerId"],
            where: { UserId: id },
        });
        res.json(servers);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function joinServer(req, res) {
    const { id } = req.params;
    const { serverId } = req.body;

    try {
        let newUserServer = await UserServers.create(
            {
                UserId: id,
                ServerId: serverId,
                joined: Date.now()
            }
        );
        return res.json(newUserServer);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    res.json("received");
}

export async function leaveServer(req, res) {
    const { id } = req.params;
    const { serverId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                ServerId: serverId,
                UserId: id
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function addFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        let newFriend = await UserFriends.create(
            {
                UserId: id,
                FriendId: userId,
                accepted: false
            }
        );
        return res.json(newFriend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                UserId: id,
                FriendId: userId
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function acceptFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;
    
    try {
        const friend = await User.findOne({ where: { UserId: userId, FriendId: id } });
        friend.accepted = true;
        await friend.save();
        await UserFriends.create(
            {
                UserId: id,
                FriendId: userId,
                accepted: true
            }
        );
        res.json(friend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}