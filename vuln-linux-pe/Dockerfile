FROM debian:bullseye-slim


RUN apt-get update && apt-get install -y \
    apache2 \
    openssh-server \
    sudo \
    less \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m sir_smith && echo "sir_smith:thisisfine123" | chpasswd

RUN echo "sir_smith ALL=(ALL) NOPASSWD: /usr/bin/less" >> /etc/sudoers


RUN mkdir -p /var/www/html/secret \
    && mkdir -p /var/run/sshd \
    && ssh-keygen -A

COPY index.html /var/www/html/
COPY wordlist.txt /var/www/html/secret
COPY root.txt /root
COPY sshd_config /etc/ssh/sshd_config


RUN chmod 600 /root/root.txt 



EXPOSE 22 80


CMD bash -c "service apache2 start && service ssh start && tail -f /dev/null"