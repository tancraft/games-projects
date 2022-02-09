export function drawStateText(context, input, player){
    context.font = '30px arial';
    context.fillText('dernier input: ' + input.lastKey, 20, 30);
    context.fillText("dernier state actuel: " + player.currentState.state, 20, 60);

}