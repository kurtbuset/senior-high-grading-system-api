const db = require("../_helpers/db");

module.exports = {
    getNotifications,
    updateIsRead
}

async function updateIsRead(id){
    console.log('reached!')
    const notif = await db.Notification.findByPk(id)
    if(!notif) throw "Notification not found"

    notif.is_read = true
    await notif.save()

    return notif
}

async function getNotifications(id){
    return await db.Notification.findAll({
        where: {
            recipient_id: id,
            is_read: 0
        },
        order: [["createdAt", "DESC"]],
        attributes: ["id", "message", "type", "createdAt", "is_read"]   
    })
}