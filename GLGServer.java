import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class GLGServer {

    private static final int PORT = 8080;
    private static final String WEB_FOLDER = "web";

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
                new InetSocketAddress(PORT), 0
        );

        server.createContext("/", GLGServer::handleRequest);

        server.setExecutor(null);

        System.out.println("=================================");
        System.out.println(" GLG MEAT TRADING WEBSITE");
        System.out.println("=================================");
        System.out.println("Server running at:");
        System.out.println("http://localhost:" + PORT);
        System.out.println("=================================");

        server.start();
    }

    private static void handleRequest(HttpExchange exchange) throws IOException {

        String requestPath = exchange.getRequestURI().getPath();

        if (requestPath.equals("/")) {
            requestPath = "/index.html";
        }

        Path filePath = Paths.get(
                WEB_FOLDER + requestPath
        ).normalize();

        Path webPath = Paths.get(WEB_FOLDER).toAbsolutePath().normalize();

        if (!filePath.toAbsolutePath().normalize().startsWith(webPath)) {
            send404(exchange);
            return;
        }

        File file = filePath.toFile();

        if (!file.exists() || file.isDirectory()) {
            send404(exchange);
            return;
        }

        String contentType = getContentType(filePath);

        exchange.getResponseHeaders().set(
                "Content-Type",
                contentType
        );

        byte[] fileBytes = Files.readAllBytes(filePath);

        exchange.sendResponseHeaders(
                200,
                fileBytes.length
        );

        OutputStream output = exchange.getResponseBody();

        output.write(fileBytes);
        output.close();
    }

    private static String getContentType(Path path) {

        String fileName = path.toString().toLowerCase();

        if (fileName.endsWith(".html")) {
            return "text/html; charset=UTF-8";
        }

        if (fileName.endsWith(".css")) {
            return "text/css; charset=UTF-8";
        }

        if (fileName.endsWith(".js")) {
            return "application/javascript; charset=UTF-8";
        }

        if (fileName.endsWith(".png")) {
            return "image/png";
        }

        if (fileName.endsWith(".jpg") ||
            fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        if (fileName.endsWith(".webp")) {
            return "image/webp";
        }

        return "application/octet-stream";
    }

    private static void send404(HttpExchange exchange)
            throws IOException {

        String response = "404 - Page Not Found";

        exchange.sendResponseHeaders(
                404,
                response.length()
        );

        OutputStream output = exchange.getResponseBody();

        output.write(response.getBytes());

        output.close();
    }
}
