import { UserServers } from "../models/userservers.js"
import { Server } from "../models/server.js"
import { Channel } from "../models/channel.js"
import { User } from "../models/user.js"

export async function createServer(req, res) {
    const { name } = req.body;

    try {
        let newServer = await Server.create(
            {
                name
            }
        );
        return res.json(newServer);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    res.json("received");
}

export async function updateServer(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const server = await Server.findByPk(id);
        server.name = name;
        await server.save();

        res.json(server);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteServer(req, res) {
    const { id } = req.params;

    try {
        await Channel.destroy({
            where: {
                serverId: id,
            },
        });
        await Server.destroy({
            where: {
                id,
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getServerChannels(req, res) {
    const { id } = req.params;

    try {
        const channels = await Channel.findAll({
            attributes: ["id", "name"],
            where: { serverId: id },
        });
        res.json(channels);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function getServerUsers(req, res) {
    const { id } = req.params;

    try {
        await Server.findOne({
            where: { id: id },
            include: {
                model: User,
                attributes: ["id", "username"]
            }
        })
            .then((server) => {
                res.json(server.Users);
            });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function addUserServer(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        let newUserServer = await UserServers.create(
            {
                ServerId: id,
                UserId: userId,
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

export async function deleteUserServer(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                ServerId: id,
                UserId: userId
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}