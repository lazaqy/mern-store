const verifyEmailTemplate = (name, url) => {
    return `<p>Thank you for registering with MyStore, ${name}!</p> To verify your email, please click the following link: <a href="${url}" style="color: #007bff; text-decoration: none; background-color: #f8f9fa; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Verify Email</a>`;
}

export default verifyEmailTemplate;