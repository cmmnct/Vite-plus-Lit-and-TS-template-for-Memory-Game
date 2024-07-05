export default function mimePlugin() {
    return {
        name: 'vite-plugin-mime',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url.endsWith('.webp')) {
                    res.setHeader('Content-Type', 'image/webp');
                } else if (req.url.endsWith('.jpg')) {
                    res.setHeader('Content-Type', 'image/jpeg');
                } else if (req.url.endsWith('.png')) {
                    res.setHeader('Content-Type', 'image/png');
                }
                next();
            });
        }
    };
}
