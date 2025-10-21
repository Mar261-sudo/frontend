GitHub:

**Configura GitHub**

git config --global user.name "Mar261-sudo"

git config --global user.email "m79747424@gmail.com"

git config --global --list



**Inicializa el repositorio local** 

git init

git add .

git status

git commit -m "Versión inicial del frontend - HTML, CSS, JS, Bootstrap"



**Conexión de repo local con remoto**

git branch -M main

git remote add origin https://github.com/Mar261-sudo/froyectofront.git

git push -u origin main



**Generar token** 

https://github.com/settings/tokens -> marca permiso “Content: Read and Write”



**Flujo normal del trabajo** 

git add .

git commit -m "Actualiza estilos y navbar responsive"

git push



**#Conexiones**



git remote -v

git remote remove origin

git branch -M main

git remote add origin https://github.com/Mar261-sudo/froyectofront.git

git push -u origin main -> git push



