🚀 Deploying a MERN App on AWS Free Tier

Safe, Simple, Student-Friendly Guide

This guide explains the simplest and safest way to deploy a MERN application on AWS Free Tier without accidentally burning free credits 🔥.

It uses one EC2 instance, Nginx, PM2, and MongoDB Atlas Free Tier, which is the most college-friendly and justification-friendly setup.


---

✅ Recommended Architecture (Why This Works)

High-Level Architecture

Frontend (React + Vite)
Built once and served as static files by Nginx

Backend (Node.js + Express)
Runs on EC2 using PM2

Database
MongoDB Atlas (M0 Free Tier)

Hosting
AWS EC2 t3.micro (Free Tier)


This setup avoids hidden AWS costs and gives full control over deployment.


---

🆓 What Stays FREE

Service	Free Tier Details

EC2	750 hours/month (t3.micro, Linux)
EBS	Up to 30 GB
MongoDB Atlas	M0 Free Cluster
Data Transfer	Enough for demos & testing


⚠️ Avoid: RDS, Elastic Beanstalk, Fargate, Load Balancers, CloudFront


---

1️⃣ Create AWS Account

Sign up on Amazon Web Services

Enable Billing Alerts

Create a budget alert at $1




---

2️⃣ Launch EC2 Instance

EC2 → Launch Instance

AMI: Ubuntu 22.04 LTS

Instance type: t3.micro ✅ (Free Tier eligible)

Key pair: Create & download .pem

Security Group:

SSH (22)

HTTP (80)

HTTPS (443)




---

3️⃣ Connect to EC2

ssh -i yourkey.pem ubuntu@<EC2_PUBLIC_IP>


---

4️⃣ Install Required Software

sudo apt update
sudo apt install -y nodejs npm nginx git

Verify installation:

node -v
npm -v


---

5️⃣ Upload Your MERN Project

git clone https://github.com/yourrepo/mern-app.git
cd mern-app


---

6️⃣ Backend Setup (Express + Node.js)

cd backend
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=secret


---

✅ Run Backend Using PM2 (IMPORTANT)

❌ Do NOT leave node index.js running
✅ Use PM2 so the backend survives SSH exit and EC2 restarts

sudo npm install -g pm2
pm2 start index.js

Enable PM2 auto-start on reboot:

pm2 startup

⚠️ IMPORTANT
PM2 will print a command similar to this:

sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

👉 COPY THIS ENTIRE COMMAND and RUN IT EXACTLY as shown

Then save the PM2 process list:

pm2 save

✔ Backend will now auto-start automatically after EC2 reboot


---

7️⃣ MongoDB Atlas (Free & Safe)

Create an account on MongoDB Atlas

Create an M0 Free Cluster

Network Access:

Allow IP: 0.0.0.0/0 (for college/demo use)


Copy the connection URI and paste it into backend .env



---

8️⃣ Frontend Setup (React + Vite)

cd ../frontend
npm install
npm run build

⚠️ IMPORTANT (Vite vs CRA)
Vite outputs build files into dist/, NOT build/

Deploy frontend files:

sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/


---

9️⃣ Configure Nginx (Reverse Proxy)

Open the Nginx default config:

sudo nano /etc/nginx/sites-available/default

Replace the entire file with:

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}

Test and restart Nginx:

sudo nginx -t
sudo systemctl restart nginx


---

🔄 How to Restart / Update Frontend After Changes

Whenever you change frontend code or frontend .env:

cd frontend
npm run build
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo systemctl reload nginx

✔ No PM2 restart needed
✔ No EC2 restart needed


---

🎉 Deployment Complete

Visit:

http://<EC2_PUBLIC_IP>

Your MERN application is live 🚀


---

💸 How to NOT Burn AWS Free Tier Credits

Use only one EC2 instance

Use t3.micro

Stop EC2 when not demoing

Do NOT allocate Elastic IP

Use MongoDB Atlas Free Tier only

Keep billing alerts enabled



---

🧪 Faculty Justification (Ready to Paste)

> “The MERN application is deployed on AWS EC2 Free Tier using Nginx as a reverse proxy and PM2 for backend process management. MongoDB Atlas Free Tier is used to eliminate database costs while ensuring scalability.”




---

✅ Final Notes

exit from SSH is safe

EC2 stop → start works without reconfiguration

Only the public IP may change

No setup repetition required during demos