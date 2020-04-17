const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdsAt: new Date().getTime()
    }
}


module.exports= {
    generateMessage,
}