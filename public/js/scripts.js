const baseUrl = "http://localhost:5000"

fetch(`${baseUrl}/api/books`)
.then(res => res.json())
.then(res => {
    let booksHolder = document.getElementById("books-holder")
    const books = res

    books.forEach(book => {
        var row = `<tr>
                    <th scope="row">${book.id}</th>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>
                    <a href=${baseUrl + book.link} target="_blank" type="button" class="btn btn-primary btn-sm px-4">View</a>
                    </td>
                </tr>`

        booksHolder.innerHTML += row
    });

})