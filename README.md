# My small CTF Machine collection with docker

<br>
<br>
<br>

### LFI (local file inclusion)

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

### IDOR (insecure direct object reference)

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
