docker stop blog
docker rm blog
docker run --name blog -p 3306:3306 ^
-e MYSQL_ROOT_PASSWORD=1234 ^
-e MYSQL_DATABASE=blog ^
-e MYSQL_USER=edgar ^
-e MYSQL_PASSWORD=1234 ^
-d mysql:8 --default-authentication-plugin=mysql_native_password --default-time_zone=+8:00