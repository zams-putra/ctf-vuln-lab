FROM php:8.2-apache


RUN apt-get update && apt-get install -y openssh-server \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m your_ssh_username && echo "your_ssh_username:your_ssh_password" | chpasswd




RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config \
    && sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config


COPY ./html/ /var/www/html/


EXPOSE 80 22

RUN echo "FLAGGGGGGGGGGGGGGGGGGGGG" >> /home/your_ssh_username/user.txt

RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
