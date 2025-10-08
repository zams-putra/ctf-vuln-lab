# Welcome to my Labs 🍔

### Hope you enjoy it 🦖☠️🤖

There is so many Categories in here so give it a try

<br>
<br>
<br>
<br>
<br>

# 1. Web Exploitation - Lab 🕸️

<br>

## My small CTF Machine collection with docker

<br>
<br>

### Mini CTF Lab mix - 1

<br>

#### Bug :

- Bruteforce login page
- Broken function level authorization (BFLA)
- Insecure direct object reference (IDOR)
- Response manipulation
- Information disclosure
- EXIF data leak
- XSS cookie stealer
- Cookie manipulation

<br>
<br>

1. pulling image

```bash
docker pull hopkinserstomba/mini-lab-mix1
```

2. run image

```bash
docker run -p 5000:5000 hopkinserstomba/mini-lab-mix1
```

3. open browser

```bash
http://localhost:5000
```

<br>
<br>
<br>

## LFI (local file inclusion)

- linux only
- submit flag is not available in here
- only 1 bug in here h3h3

<br>
<br>

1. pulling image

```bash
docker pull hopkinserstomba/ctf-vuln-lfi
```

2. run image

```bash
docker run -p 5000:5000 hopkinserstomba/ctf-vuln-lfi
```

3. open browser

```bash
http://localhost:5000
```

<br>
<br>
<br>

# 2. General - Lab 🌐

<br>

## Linux Privilege escalation and bruteforce SSH

- submit flag is not available in here
- linux only i think

<br>
<br>

1. clone repo

```bash
docker pull hopkinserstomba/ctf-vuln-pe
```

2. run image

```bash
docker run -p 2222:22 -p 8888:80 hopkinserstomba/ctf-vuln-pe
```

3. open browser

```bash
http://localhost:8888
```

<br>
<br>
<br>

## SQL Injection bypass login + privilege escalation (BETA)

- i've never try this before
- so give it a try

<br>
<br>

1. clone repo

```bash
docker pull hopkinserstomba/ctf-vuln-sqli
```

2. run image

```bash
docker run -p 2222:22 -p 5000:5000 hopkinserstomba/ctf-vuln-sqli
```

3. open browser

```bash
http://localhost:5000
```

<br>
<br>
<br>

# 3. Binary Exploitation - Lab 🍕

<br>

## Stack Based Buffer Overflow

### hint:

```C
#define admin_levels "root"

//---------------------
    char level[14] = "user";
    char name[14];
    char answer[14];

    printf("What is your name: ");
    scanf("%s", name);

    printf("alright %s what is answer of 1 + 1 ?\n", name);
    scanf("%s", answer);
```

<br>

### Play

<br>

1. get file

```bash
wget "https://raw.githubusercontent.com/zams-putra/ctf-vuln-lab/refs/heads/main/binary-exploitation/stack_based_buff_overflow.c"
```

2. or download it manual [Link in here](https://raw.githubusercontent.com/zams-putra/ctf-vuln-lab/refs/heads/main/binary-exploitation/stack_based_buff_overflow.c)

3. compile :

```bash
g++ stack_based_buff_overflow.c -o play
```

4. play :

```bash
./play
```

<br>
<br>
<br>
<br>

# 4. Reverse Engineering - Lab 🧩

<br>

## Static Analysis - What is my PIN☎️

<br>

### Play

<br>

1. get file

```bash
wget "https://raw.githubusercontent.com/zams-putra/ctf-vuln-lab/refs/heads/main/reverse-engineering/pin.c"
```

2. or download it manual [Link in here](https://raw.githubusercontent.com/zams-putra/ctf-vuln-lab/refs/heads/main/reverse-engineering/pin.c)

3. compile :

```bash
gcc pin.c -o pin
```

4. play :

```bash
./pin
```

<br>
<br>

## Static Analysis - What is my Password🔐

<br>

### Play

<br>

1. get file

```bash
wget "https://raw.githubusercontent.com/zams-putra/ctf-vuln-lab/refs/heads/main/reverse-engineering/password.c"
```

2. or download it manual [Link in here](https://raw.githubusercontent.com/zams-putra/ctf-vuln-lab/refs/heads/main/reverse-engineering/password.c)

3. compile :

```bash
gcc password.c -o password
```

4. play :

```bash
./password
```

<br>
<br>

# Soon
