git reset --hard
git pull

npm run --prefix ./article-renderer build
tsc -p sheltify-lib

npm i --prefix ./sheltify-admin
npm run --prefix ./sheltify-admin build-prod
sudo rm -rf /var/www/html/sheltify/admin
sudo mkdir /var/www/html/sheltify/admin
sudo cp -r ./sheltify-admin/dist/browser/* /var/www/html/sheltify/admin
sudo cp ./sheltify-admin/.htaccess /var/www/html/sheltify/admin
