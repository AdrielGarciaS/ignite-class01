import { Button } from './Button';

interface SideBarProps {
  genres: GenreResponseProps[]
  selectGenre(id: number): void
  selectedGenreId: number
}

export function SideBar({ 
  genres, 
  selectedGenreId, 
  selectGenre
}: SideBarProps) {

  function handleClickButton(id: number) {
    selectGenre(id)
  }

  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {genres.map(genre => (
          <Button
            id={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => handleClickButton(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>

    </nav>
  )
}