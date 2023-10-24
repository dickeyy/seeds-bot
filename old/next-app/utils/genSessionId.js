const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();

// Generate session data
function genSessionId() {
    var sessionId = uidgen.generateSync(64);
    return sessionId;
}

// Export genSessionId
exports.genSessionId = genSessionId;