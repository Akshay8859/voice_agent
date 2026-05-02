import emailjs from "emailjs-com";

function sendEmail(to,sub,mes) {
  emailjs.send(
    "service_0zvgt3r",
    "template_nvum3qm",
    {
      to_email: to,
      subject: sub,
      message: mes
    },
    "IzElB0PApSlmee2PP"
  )
  .then(() => {
    console.log("Email sent");
  })
  .catch((err) => {
    console.log("Error:", err);
  });
}

export {sendEmail}