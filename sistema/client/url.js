const useLocalServer = true;

const liveProtocol = 'https';
const liveHostname = '';
const liveURL = liveProtocol + '://' + liveHostname + '/';

const localProtocol = 'http';
const localHostname = 'localhost';
const localPort = '3001';
const localURL = localProtocol + '://' + localHostname + ':' + localPort + '/';

const url = useLocalServer ? localURL : liveURL;

export default url;
