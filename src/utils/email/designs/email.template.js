export const emailTemplate = ({otp , title = "Confirm Email"} = {}) => {
   return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Confirmation</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <style>
    body {
     padding: 0;
     margin: 0;
     background-image: url(img/back.jpg);
     background-repeat: no-repeat;
     background-size: cover;
     display: flex;
     justify-content: center;
     align-items: center;
     max-height:90vb;
     overflow: auto;
    }
    .box{
    max-width: 1000px;
    height: auto;
    width: 90%;
    max-height: 90vh;
    
    padding:30px 60px;
    border-radius: 20px;
    box-sizing: border-box;
    }

.wave-button {
      position: relative;
      display: inline-block;
      padding: 14px 36px;
      font-size: 20px;
      color: #cc00ff;
      border: 2px solid #cc00ff;
      border-radius: 50px;
      text-decoration: none;
      overflow: hidden;
      transition: color 0.3s ease;
    }

    .wave-button::before,
    .wave-button::after {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      top: 100%;
      left: -50%;
      z-index: 0;
      transition: top 0.5s ease;
    }

    .wave-button::before {
      background-color: #cc00ff;
    }

    .wave-button::after {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23cc00ff" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,181.3C384,160,480,96,576,90.7C672,85,768,139,864,144C960,149,1056,107,1152,106.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0.4;
    }

    .wave-button:hover::before,
    .wave-button:hover::after {
      top: 0;
    }

    .wave-button span {
      position: relative;
      z-index: 1;
    }

    .wave-button:hover {
      color: #ffffff;
    }
   .twit {
    position: relative;
    display: inline-block;
    width: 55px;
    height: 55px;
    padding: 7px;
    margin: 20px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    transition: color 0.3 ease;
   }
   .twit::before,
   .twit::after{
     content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      top: 100%;
      left: -50%;
      z-index: 0;
      transition: top 0.5s ease;
   }
   .twit::before {
      background-color: #cc00ff;
    }
    .twit::after {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23cc00ff" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,181.3C384,160,480,96,576,90.7C672,85,768,139,864,144C960,149,1056,107,1152,106.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0.4;
    }
    .twit:hover::before,
    .twit:hover::after {
      top: 0;
    }
  .twit img{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
   
  </style>
</head>
<body>
<div class="box">
<table border="0"  width="100%"  style="max-width: 1000px; margin:auto;padding:30px;border-radius: 20px; background-color: #00000026;border:1px solid #bd10f7;">
    <tr>
      <td>
        <table border="0" width="100%">
          <tr>
            <td>
              <h1>
                <img width="140px" src="">
              </h1>
            </td>
            <td>
              <p style="text-align: right;">
                <a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none; color: #cc00ff;">visit us</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;">
          <tr>
            <td style="background-color:transparent;height:50px;font-size:20px;color:#cc03f0;">
              <img style="padding-top:5px;"  width="170px" height="150px" src="https://cdn-icons-png.flaticon.com/512/9152/9152783.png">
              <h1 style=" margin: 15px; color: #c0f; font-size:40px ;text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);">${title}</h1>
            </td>
          </tr>
          <tr>
            <td>
            
          </tr>
          <tr>
            <td>
              <p style="padding:0px 100px;"></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
          
              <a href="" class="wave-button"><span>${otp}</span></a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
          <tr>
            <td>
              <h3 style="margin-top:20px; color:#8b08f0f7">Stay in touch</h3>
            </td>
          </tr>
          <tr>
            <td>
              <div style="margin-top:20px;">
                <a href="${process.env.facebookLink}" style="text-decoration: none;">
                  <span class="twit">
                    <img src="https://img.icons8.com/?size=100&id=106163&format=png&color=FFFFFF" width="55px" height="55px">
                  </span>
                </a>
                <a href="${process.env.instegram}" style="text-decoration: none;">
                  <span class="twit">
                    <img src="https://img.icons8.com/?size=100&id=RhYNENh5cxlS&format=png&color=FFFFFF" width="50px" height="50px">
                  </span>
                </a>
                <a href="${process.env.twitterLink}" style="text-decoration: none;">
                  <span class="twit">
                    <img src="https://img.icons8.com/?size=100&id=A4DsujzAX4rw&format=png&color=FFFFFF" width="50px" height="50px">
                  </span>
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  </div>
</body>
</html>`
}