const fs = require('fs');
const pg = require('pg');
const url = require('url');

const config = {
    user: "avnadmin",
    password: "AVNS_TklwhzqMAVKKq1ep_EK",
    host: "pg-ef68f9f-fchs-sms2024.g.aivencloud.com",
    port: 27241,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUUPfvk0A9GVAoHA05CRHwk44CtAgwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvOGM1MDRlNGItYTRiOC00ZWZkLWI2MmMtN2M4YTQyMGQz
ODliIFByb2plY3QgQ0EwHhcNMjQwOTI4MTEwNTEzWhcNMzQwOTI2MTEwNTEzWjA6
MTgwNgYDVQQDDC84YzUwNGU0Yi1hNGI4LTRlZmQtYjYyYy03YzhhNDIwZDM4OWIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBALZ0iO4s
SyybCdNUcap2y3lkBj9XvYWQCOlUwV2fb5ITlFGyEN6xx/XYo/RvhTQTugy6IAEN
8ckeAfQUpdKuCILDYTID2stajQSS1/bWrUjRPMWv9FV0Dm4pzfUyViPgsQ9M9+pG
BcKbIkXECiLj5fj98k0d4C/5F3Sq9zVFoDoqaVYYvLeN+ldbWisYSMr3F1tlhHC0
NkiSHS3sTWBBNF6rc9ThYqo90iE1PacGfeB3H4m7AUH5pL9c6kjTjxUm4ZzJm6ZR
Tk8LAmeO0vxECAPO2/auRgeqOdIKmWyqBG5ViwaJLdfh0p2+zoQC0g5NR2UkIqyY
IESl4jtfxLph/xFHQTlORprmltkLJCP47aIjHWIlGEGE4971sEElQHdp9Cx8IQ8G
/6X01LUzjq46nSvoLY++tQiTrAMr6QOyaNrgC02NOgnXcJNlA2lGtDIj2ZYu27Ph
zG+GlXE+YKF54rBDqVCvKhg2cGAwjhCXP3WmXCLy6IFICEH38CvAm67/2wIDAQAB
oz8wPTAdBgNVHQ4EFgQUGifsmYJYr//QxEMTYnxvgHtc8QwwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAFGr8+iEB9yyYVzM
Aw8Qorg0qB56oO6rhzCAI2eTxvnR8NK+pXDapVHvo+2FfpLbAzoIh2VssjrCCF17
DS+s3VYCA6MVpglIYkZtVKjeKveaqV5yC2EsiTucxcmfQ2dLZVaGBePqx+7DKffD
AxjVwx1blU8L0IDrXa7UXYC8rxsFEqbaZNPwSfSCrEq10H/ISpT1Ht1r2X/HyLhh
H34/anQOxks2gXHgELLvzczGFcoGpHJEmFPd4IIYlxVvdCDnuGseeothRL+1mjaB
WB/u9538blGCa0v+jC8HIpr+VUMvl9j8/mkDGq5huxGzvS6HFv0r3hlRw2+gyiQ1
bR74ejG1HVRX6uQz7Own5uCTPgFOO5tCs0bC6hCIFR8z862epSYu0sJj0rqQZPEx
x8BoEnJoLGW1KGVyZCtGV5j+MqCu9AipUzrq+gxgGJjdLqmi3lWDgcPer0uCsD4e
SNDxZzgDl/4m7OObjqItRLjG1sUz6Rn9KC14+UxiJaSnjWOnrg==
-----END CERTIFICATE-----`,
    },
};

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});