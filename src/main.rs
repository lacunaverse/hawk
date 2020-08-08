use std::io;
use tui::backend::CrosstermBackend;
use tui::layout::*;
use tui::widgets::*;
use tui::Terminal;

fn main() -> Result<(), io::Error> {
    let stdout = io::stdout();

    let backend = CrosstermBackend::new(stdout);

    let mut terminal = Terminal::new(backend)?;
    terminal.draw(|x| {
        let size = x.size();
    });

    Ok(())
}
