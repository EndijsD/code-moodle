// EDIT THIS
const useLocalServer = true;
// THE THING ABOVE

//To be implemented
const liveProtocol = "https";
const liveHostname = "system-server.up.railway.app";
const liveURL = liveProtocol + "://" + liveHostname + "/";
// Yes

const localProtocol = "http";
const localHostname = "localhost";
const localPort = "3001";
const localURL = localProtocol + "://" + localHostname + ":" + localPort + "/";

const url = useLocalServer ? localURL : liveURL;

export default url;
