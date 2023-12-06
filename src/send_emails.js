const sendgrid = require ('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

 const sendEmail = ({ to, from, subject, text, html }) => {
    const msg = { to, from, subject, text, html };
    return sendgrid.send(msg);
};


app.post('/api/test-email', async(req, res)=>{
    try {
        await sendEmail({
            //the client email 
            to: 'address you intend sending email to’(Try with any of your emails)',
            //sendGrid sender id 
            from: 'your real email goes here (the one you signed up with)',
            subject: 'Does this work?',
            text: 'Glad you are here .. yes you!',
            html:'<strong>It is working!!</strong>'
        });
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


module.exports = sendEmail;