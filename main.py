# Spieler erstellen
# Möglichkeit die Punkte einzustellen
# Möglichkeit Punkte einzugeben
# Möglichkeit zwischen Single und Double-Out zu wählen
# Mitzählen und berechnen, ob jemand das Spiel gewonnen hat + bust Funktion

# Spieler Objekt?

## calculates possible finishes
## writes wins to database
## count number of darts thrown
## calculate average
# Game Objekt?

from classes import Player
from database_functions import list_available_players, add_game_to_history, return_players_stats, add_average_to_history
import os

print("Available players: {}".format(list_available_players()))
# Player Input muss enums Logik folgen, um Fehler auf der Datenbank zu vermeiden

def show_stats(playername):
    stats = return_players_stats(playername)
    for k, v in stats.items():
        print(f"{k}: {v}")
        
def play_game():
    start = 501
    continue_game = True
    
    user1 = input("\nWho throws first?: ")
    user2 = input("Who is too stupid to reach the Bulls-Eye?: ")
    
    os.system("clear")

    print("Game on.")  
    
    player1 = Player(user1, start)
    player2 = Player(user2, start)
        
    while continue_game:
        player1.play_round()
        player2.play_round()
        if player1.has_won or player2.has_won:
            first_name = player1.name
            second_name = player2.name
            add_game_to_history(first_name, second_name, winner_pl1=player1.has_won)
            add_average_to_history(player1.name, player2.name, player1.average, player1.twenty6)
            add_average_to_history(player2.name, player1.name, player2.average, player2.twenty6)
            continue_game = False

option = input("Game or stats?: ")
if option == "stats":
    player_stats = input("For which player?: ")
    show_stats(player_stats)
else:
    play_game()









            
        
    
        



