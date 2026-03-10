<?php
/**
 * NU Bank Virtual - API de Login
 * POST /api/login.php
 */
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare("SELECT id, email, senha_hash, tipo_conta, status, is_admin FROM usuarios WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['senha'], $user['senha_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciais inválidas']);
        exit();
    }

    if ($user['status'] !== 'ativo') {
        http_response_code(403);
        echo json_encode(['error' => 'Conta não está ativa']);
        exit();
    }

    // Atualizar último acesso
    $stmt = $pdo->prepare("UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    // Log de acesso
    $stmt = $pdo->prepare("INSERT INTO logs_acesso (usuario_id, acao, ip, user_agent) VALUES (?, 'login', ?, ?)");
    $stmt->execute([$user['id'], $_SERVER['REMOTE_ADDR'] ?? '', $_SERVER['HTTP_USER_AGENT'] ?? '']);

    unset($user['senha_hash']);
    echo json_encode(['success' => true, 'user' => $user]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno']);
}
