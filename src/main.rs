// std
use std::io::*;
use std::time::Duration;

// external
use crossterm::{
    cursor::{DisableBlinking, MoveTo},
    event::{poll, read, EnableMouseCapture, Event},
    execute, Result,
};
use tui::{
    backend::CrosstermBackend, layout::*, style::*, symbols::*, text::*, widgets::*, Terminal,
};

fn main() -> Result<()> {
    let std = stdout();

    let backend = CrosstermBackend::new(std);

    let mut terminal = Terminal::new(backend)?;
    let _main = terminal.draw(|f| {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .margin(1)
            .constraints([Constraint::Percentage(10), Constraint::Percentage(50)].as_ref())
            .split(f.size());

        let block = Block::default().title("Views").borders(Borders::ALL);

        f.render_widget(block, chunks[0]);

        let block = Block::default()
            .title("")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::Cyan));

        f.render_widget(block, chunks[1]);

        let titles = ["Default", "Second"]
            .iter()
            .cloned()
            .map(Spans::from)
            .collect();

        let tab = Tabs::new(titles)
            .block(Block::default().title("Views").borders(Borders::ALL))
            .style(Style::default().fg(Color::White))
            .highlight_style(Style::default().fg(Color::LightGreen))
            .divider(DOT);

        f.render_widget(tab, chunks[0])
    });

    Ok(())
}
