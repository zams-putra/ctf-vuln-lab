FROM alpine:3.20

ENV DEBIAN_FRONTEND=noninteractive

RUN apk update && apk add --no-cache \
    openssh \
    mariadb \
    mariadb-client \
    sudo \
    net-tools \
    nodejs \
    npm \
    vim \
    curl \
    shadow

RUN adduser -D ninja && echo "ninja:ninjagogo33" | chpasswd
RUN echo "ninja ALL=(ALL) NOPASSWD: /usr/bin/vim" >> /etc/sudoers

WORKDIR /app
COPY . .
COPY my.cnf /etc/my.cnf

RUN mkdir -p /docker-entrypoint-initdb.d /var/lib/mysql /run/mysqld /var/run/sshd && \
    chown -R mysql:mysql /var/lib/mysql /run/mysqld

RUN mv root.txt /root/root.txt && mv sshd_config /etc/ssh/sshd_config && mv init.sql /docker-entrypoint-initdb.d/
RUN chmod 600 /root/root.txt && ssh-keygen -A
RUN npm install --production

EXPOSE 3306 22 5000

CMD ["sh", "-c", "\
  if [ ! -d /var/lib/mysql/mysql ]; then \
    echo '[Init] Running mysql_install_db...'; \
    mysql_install_db --user=mysql --datadir=/var/lib/mysql --port=3306; \
  fi && \
  echo '[Run] Starting mysqld...'; \
  mysqld --user=mysql --datadir=/var/lib/mysql --verbose --console & \
  echo '[Wait] Checking MySQL socket...' && \
  for i in $(seq 1 30); do \
    netstat -tulpn | grep 3306 && mysqladmin ping --silent && break; \
    echo '[Wait] MySQL not ready yet...'; \
    sleep 1; \
  done && \
  echo '[Init] Importing init.sql...' && \
  mysql < /docker-entrypoint-initdb.d/init.sql && \
  echo '[OK] Starting ssh and app...' && \
  /usr/sbin/sshd && \
  npm start"]
