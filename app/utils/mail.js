import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mana2016381@gmail.com',
        pass: 'przzubqvffmhwfmb'
    }
})  