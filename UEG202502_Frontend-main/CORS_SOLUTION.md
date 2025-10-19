# Solução para Problema de CORS

## 🚨 Problema
```
Access to XMLHttpRequest at 'http://localhost:8080/caluno/aluno' from origin 'http://localhost:4200' has been blocked by CORS policy
```

## ✅ Soluções Implementadas

### 1. **Proxy do Angular (Solução Temporária)**
- Criado arquivo `proxy.conf.json`
- Atualizado `package.json` para usar o proxy
- **Como usar:** Execute `npm start` (já configurado)

### 2. **Configuração CORS no Backend (Solução Definitiva)**
- Criado arquivo `CorsConfig.java`
- Adicione este arquivo no seu projeto Spring Boot

## 🔧 Como Aplicar as Soluções

### **Opção 1: Usar Proxy (Rápido)**
1. Pare o servidor Angular (`Ctrl+C`)
2. Execute: `npm start`
3. O proxy redirecionará automaticamente as requisições

### **Opção 2: Configurar CORS no Backend (Recomendado)**
1. Copie o arquivo `CorsConfig.java` para seu projeto Spring Boot
2. Coloque em: `src/main/java/com/br/config/CorsConfig.java`
3. Reinicie o backend Spring Boot
4. Execute o Angular normalmente

## 📁 Arquivos Criados

### `proxy.conf.json`
```json
{
  "/caluno/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### `CorsConfig.java`
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 🚀 Testando a Solução

1. **Backend rodando:** `http://localhost:8080`
2. **Frontend rodando:** `http://localhost:4200`
3. **Acesse:** `http://localhost:4200/alunos`

## ⚠️ Notas Importantes

- **Proxy:** Funciona apenas em desenvolvimento
- **CORS:** Necessário para produção
- **Ambos:** Podem ser usados simultaneamente

## 🔍 Verificação

Se ainda houver problemas:
1. Verifique se o backend está rodando na porta 8080
2. Verifique se a URL no `AlunoService` está correta
3. Verifique os logs do navegador (F12 → Console)
4. Verifique os logs do backend
