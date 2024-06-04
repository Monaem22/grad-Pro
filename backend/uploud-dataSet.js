
const path = require("path");
const fs = require("fs").promises;

async function uploadDirectory(dirPath, uploadedProjects) {
    try {
        var files = await fs.readdir(dirPath);
        if (files.length === 0) {
            console.error('Directory is empty', dirPath);
            throw new Error(`Directory is empty on this path : 
            ${dirPath}`);
        } 
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) {
                await uploadDirectory(filePath, uploadedProjects); 
            } else {
                const newFileName = file.replace(/\s/g, '_'); // Replace spaces with underscore
                const newFilePathend = path.join(__dirname, "Uploads-projects", newFileName); 
                await fs.rename(filePath, newFilePathend); // Move file to static directory

                const newPdfPath = `/app/project/${newFileName}`;
                await uploadedProjects.push(newPdfPath); 
            }
        }

} catch (error) {
    if (error.code === 'ENOENT') {
        throw new Error(`path is not a valid  :
        ${dirPath}`);
    }
    throw error;
}
}


module.exports = uploadDirectory;
