# below, some unicode chars extracted from the following URL while diggin how this dude sends unicode chars through SMS
# https://github.com/chadselph/chessms/blob/master/src/chessboard.erl
# also : http://chadselph.github.io/smssplit/
# Also R: his codes: "16#2654" ==> echo -e "\u2654";P

# from "https://github.com/chadselph/chessms/blob/master/src/chessboard.erl"
# to test: echo -e $white_king

white_king="\u2654"    # 16#2654
white_queen="\u2655"   # 16#2655
white_rook="\u2656"    # 16#2656
white_bishop="\u2657"  # 16#2657
white_knight="\u2658"  # 16#2658
white_pawn="\u2659"    # 16#2659
black_king="\u265A"    # 16#265A
black_queen="\u265B"   # 16#265B
black_rook="\u265C"    # 16#265C
black_bishop="\u265D"  # 16#265D
black_knight="\u265E"  # 16#265E
black_pawn="\u265F"    # 16#265F
square_dark="\u2593"   # 16#2593
square_light="\u2001"  # 16#2001
