# My small CTF Machine collection with docker

<br>
<br>
<br>

## Mini CTF Lab mix - 1

<br>

### Bug :

- Broken function level authorization (BFLA)
- Bruteforce login page
- Insecure direct object reference (IDOR)
- Response manipulation
- Information disclosure

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

## IDOR (insecure direct object reference)

- submit flag is not available in here
- only 1 bug in here h3h3

<br>
<br>

1. clone repo

```bash
docker pull hopkinserstomba/ctf-vuln-idor
```

2. run image

```bash
docker run -p 5000:5000 hopkinserstomba/ctf-vuln-idor
```

3. open browser

```bash
http://localhost:5000
```

<br>
<br>
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

## Soon
