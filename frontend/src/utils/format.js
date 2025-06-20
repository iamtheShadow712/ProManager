export function formatDateToInput(value) {
    const date = new Date(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}


export const convertTextToHTML = (text) => {
    const lines = text.split('\n');
    const htmlLines = [];
    let inList = false;

    for (const line of lines) {
        if (line.trim().startsWith('-')) {
            if (!inList) {
                htmlLines.push('<ul>');
                inList = true;
            }
            htmlLines.push(`<li>- ${line.trim().substring(1).trim()}</li>`);
        } else {
            if (inList) {
                htmlLines.push('</ul>');
                inList = false;
            }
            if (line.trim()) htmlLines.push(`<p>${line.trim()}</p>`);
        }
    }

    if (inList) {
        htmlLines.push('</ul>');
    }

    return htmlLines.join('');
};