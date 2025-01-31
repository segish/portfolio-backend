const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    try {
        if (filePath) {
            const absolutePath = path.join(__dirname, '..', filePath);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

module.exports = { deleteFile }; 