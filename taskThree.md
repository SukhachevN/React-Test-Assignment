```typescript
export interface Book {
    id: string;
    name: string;
}

export const BooksList: FC<{ books: Book[] }> = ({ books }) => {
    return (
        <ul>
            { books.map((book, i) => <li key={i}>{book.name}</li>}) }
        </ul>
    )
}
```

1. Index passed as key prop, if array changes, then React cant determine which elements had changed and which not, as result we get unnecessary rerenders, sometimes also it can broke logic of application.

2. Need use book.id instead of index as key prop, book.id also must be unique.

3. Yes, in case if array of books never changes.
