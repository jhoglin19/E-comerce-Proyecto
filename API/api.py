from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import re
import bcrypt

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos MySQL
db = mysql.connector.connect(
    host="localhost",
    port="3306",
    user="root",  # Tu usuario de MySQL
    password="",  # Tu contraseña de MySQL
    database="e-comerce"  # El nombre de tu base de datos
)

cursor = db.cursor(dictionary=True)

# Función para validar el email
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Función para verificar si el email ya existe
def email_exists(email):
    cursor.execute("SELECT * FROM customers WHERE email = %s", (email,))
    return cursor.fetchone() is not None

# Función para verificar si el nombre de usuario ya existe
def username_exists(username):
    cursor.execute("SELECT * FROM customers WHERE username = %s", (username,))
    return cursor.fetchone() is not None

# Endpoint de login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')  # Cambié esto para que obtenga 'email'
    password = data.get('password')  # Cambié esto para que obtenga 'password'
    
    if not email or not password:
        return jsonify({'message': 'Faltan datos del usuario'}), 400

    cursor.execute("SELECT * FROM customers WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):  # Verificar la contraseña con bcrypt
        return jsonify({'message': 'Inicio de sesión exitoso', 'user': user}), 200
    else:
        return jsonify({'message': 'Credenciales incorrectas'}), 401

# Nuevo endpoint de registro
@app.route('/registro', methods=['POST'])
def registro():
    try:
        data = request.json
        
        
        nombre = data.get('nombre')
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        is_supplier = data.get('isSupplier', False)

        # Validaciones
        if not all([nombre, email, username, password]):
            return jsonify({'success': False, 'message': 'Todos los campos son obligatorios'}), 400

        if not is_valid_email(email):
            return jsonify({'success': False, 'message': 'El formato del email no es válido'}), 400

        if email_exists(email):
            return jsonify({'success': False, 'message': 'Este email ya está registrado'}), 400

        if username_exists(username):
            return jsonify({'success': False, 'message': 'Este nombre de usuario ya está en uso'}), 400

        # Hash de la contraseña
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insertar nuevo usuario en la base de datos
        sql = """
        INSERT INTO customers (name, email, username, password, is_supplier) 
        VALUES (%s, %s, %s, %s, %s)
        """
        values = (nombre, email, username, hashed_password, is_supplier)
        
        cursor.execute(sql, values)
        db.commit()

        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente'
        }), 201

    except mysql.connector.Error as err:
        print(f"Error de MySQL: {err}")
        db.rollback()
        return jsonify({
            'success': False,
            'message': 'Error al registrar el usuario en la base de datos'
        }), 500
    except Exception as e:
        print(f"Error general: {e}")
        return jsonify({
            'success': False,
            'message': 'Error en el servidor'
        }), 500

# Endpoint para obtener los productos
@app.route('/products', methods=['GET'])
def get_products():
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    return jsonify(products), 200

if __name__ == '__main__':
    app.run(debug=True)
