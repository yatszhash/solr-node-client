openssl pkcs12 -export -out server-crt.pkcs12 -in server-crt.pem -inkey server-key.pem
rem openssl pkcs12 -export -in my.crt -inkey server-key.pem -certfile intermediary.pem -name "tomcat" -out keystore.p12
