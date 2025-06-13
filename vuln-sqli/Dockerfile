FROM debian:bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update && apt-get install -y \
    openssh-server \
    mariadb-server \
    sudo \
    nodejs \
    npm \
    vim \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m ninja && echo "ninja:ninjagogo33" | chpasswd
RUN echo "ninja ALL=(ALL) NOPASSWD: /usr/bin/vim" >> /etc/sudoers

WORKDIR /app
COPY . .

RUN mkdir -p /docker-entrypoint-initdb.d && mv root.txt /root && mv sshd_config /etc/ssh/sshd_config && mv init.sql /docker-entrypoint-initdb.d/


RUN mkdir -p /var/run/sshd \
    && ssh-keygen -A



RUN chmod 600 /root/root.txt 




RUN npm install



EXPOSE 22 5000


CMD ["bash", "-c", "service mysql start && until mysqladmin ping --silent; do sleep 1; done && mysql < /docker-entrypoint-initdb.d/init.sql && service ssh start && npm start"]
