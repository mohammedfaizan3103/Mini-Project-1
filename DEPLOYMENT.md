Below is the **simplest, safest way to deploy a MERN app on AWS using Free Tier / free credits** without accidentally burning them 🔥
I’ll give you **one recommended setup** (best balance of simplicity + cost control) and briefly mention alternatives.

---

## ✅ **RECOMMENDED: MERN on AWS using EC2 (Free Tier) + Nginx**

This is the **most common college/project-friendly approach** and easiest to justify.

![Image](https://miro.medium.com/1%2ArJ_YbOr71X1iKrrW3do4nQ.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/0%2A5G3I0kk_vziMC9Uw)

![Image](https://www.digitalocean.com/api/static-content/v1/images?src=https%3A%2F%2Fjournaldev.nyc3.cdn.digitaloceanspaces.com%2F2019%2F03%2Fnginx-reverse-proxy.png\&width=1920)

![Image](https://miro.medium.com/1%2AhXuuhny2NRwVopbkfz5caw.png)

---

## 🧠 High-level Architecture

* **Frontend (React)** → Built & served by **Nginx**
* **Backend (Express + Node.js)** → Runs on EC2
* **Database (MongoDB)** → **MongoDB Atlas Free Tier**
* **Hosting** → **AWS EC2 t2.micro (Free Tier)**

---

## 🆓 What stays FREE

| Service       | Free Tier                    |
| ------------- | ---------------------------- |
| EC2           | 750 hrs/month (t2.micro)     |
| EBS           | 30 GB                        |
| MongoDB Atlas | M0 cluster                   |
| Data transfer | Limited but enough for demos |

⚠️ **Avoid:** RDS, Elastic Beanstalk, Fargate, CloudFront (for now)

---

## STEP-BY-STEP (Simple & Safe)

---

## 1️⃣ Create AWS Account (Free Tier)

* Sign up on **Amazon Web Services**
* Enable **Billing Alerts** (VERY IMPORTANT)

  * Set alert at **$1**

---

## 2️⃣ Launch EC2 Instance

* Service → **EC2 → Launch Instance**
* AMI: **Ubuntu 22.04 LTS**
* Instance type: **t2.micro**
* Key pair: create & download `.pem`
* Security group:

  * Allow **SSH (22)**
  * Allow **HTTP (80)**
  * Allow **HTTPS (443)**

---

## 3️⃣ Connect to EC2

```bash
ssh -i yourkey.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## 4️⃣ Install Required Software

```bash
sudo apt update
sudo apt install -y nodejs npm nginx git
```

Check:

```bash
node -v
npm -v
```

---

## 5️⃣ Upload Your MERN App

```bash
git clone https://github.com/yourrepo/mern-app.git
cd mern-app
```

---

## 6️⃣ Backend Setup (Express)

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=secret
```

Run backend:

```bash
node index.js
```

👉 Use **PM2** (important so server doesn’t stop):

```bash
sudo npm install -g pm2
pm2 start index.js
pm2 startup
pm2 save
```

---

## 7️⃣ MongoDB (FREE & SAFE)

* Go to **MongoDB Atlas**
* Create **M0 Free Cluster**
* Whitelist:

  * `0.0.0.0/0` (for college projects)
* Copy connection URI → paste in `.env`

✅ This avoids AWS database costs entirely

---

## 8️⃣ Frontend Setup (React)

```bash
cd ../frontend
npm install
npm run build
```

Copy build files:

```bash
sudo cp -r build/* /var/www/html/
```

---

## 9️⃣ Configure Nginx (Proxy API Calls)

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace content:

```nginx
server {
    listen 80;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Restart:

```bash
sudo systemctl restart nginx
```

---

## 🎉 DONE

Visit:

```
http://<EC2_PUBLIC_IP>
```

Your **MERN app is LIVE** 🚀

---

## 💸 How to NOT Burn Credits (Very Important)

✔ Use **ONE EC2 instance only**
✔ Keep instance **t2.micro**
✔ Use **MongoDB Atlas Free**
✔ Delete unused AMIs, volumes
✔ Stop EC2 when not needed
✔ Enable **billing alert**

---

## ❌ What NOT to Use (Credit Killers)

| Service           | Why                      |
| ----------------- | ------------------------ |
| Elastic Beanstalk | Creates hidden resources |
| RDS               | Expensive                |
| Fargate           | Pay-per-second           |
| CloudFront        | Extra bandwidth cost     |

---

## 📌 If you want EVEN SIMPLER (Alternative)

* **Frontend:** Vercel (FREE)
* **Backend:** EC2
* **DB:** MongoDB Atlas

👉 Best if you want **zero frontend server config**

---

## 🧪 Faculty Justification (Short & Strong)

> “The application is deployed on AWS EC2 Free Tier using Nginx and PM2. MongoDB Atlas Free Tier is used to avoid database costs while ensuring scalability.”

---

If you want, I can:

* Give you a **deployment checklist**
* Write a **report section**
* Convert this into **resume-ready architecture**
* Or help deploy **your exact repo step-by-step**

Just tell me 👍
