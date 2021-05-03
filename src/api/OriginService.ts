export default {

    getOrigin() {
        const protocol = location.protocol;
        const hostname = location.hostname;
        const port = location.port;
        
        if (port) {
            return `${protocol}//${hostname}:${port}`;
        } else {
            return `${protocol}//${hostname}`;
        }
    }
}