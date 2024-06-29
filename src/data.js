export default fetch(`${process.env.PUBLIC_URL}/movies.tsv`).then((resp) => resp.text()).then(processResponse)

async function processResponse(resp) {
    const rows = resp.split('\r\n');
    const names = rows[0].split('\t');
    const out = []
    for (let index = 1; index < rows.length; index++) {
        let row = rows[index].split('\t');
        row = parseRow(row, names);
        if (row.title && row.title != '#ERROR!') out.push(row)
    }

    out.sort((a, b) => {
        if (a.title === '#ERROR!') return 1;
        if (b.title === '#ERROR!') return -1;
        return (a.title || '').localeCompare(b.title)
    })

    return out
}

function parseRow(row, columns) {
    const out = {}

    for (let column = 0; column < columns.length; column++) {
        let name = columns[column].toLowerCase();
        let value = row[column];
        if (value == "TRUE") value = true;
        if (value == "FALSE") value = false;
        if (name == "released") value = new Date(value);
        out[name] = value;
    }

    out.imdb = `https://www.imdb.com/title/${out.id}`

    return out;
}