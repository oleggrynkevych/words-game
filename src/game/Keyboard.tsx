const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const buttons = rows.map(row => row.split(''))

export const Keyboard = ({onBackspace, onPressed, letterClasses}) => {
  return (
    <div className='keyboard'>
        <div>
        {
            buttons.map((row, index) => ( 
                <div key={index}>
                    {
                        row.map((letter, index) => (
                            <button onClick={() => onPressed(letter)} key={index} className={letterClasses[letter]}>
                                {letter}
                            </button>
                        ))
                    }
                </div>
            ))
        }
        </div>

        <div>
            <button onClick={() => onBackspace()}>Backspace</button>
        </div>
    </div>
  )
}