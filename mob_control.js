var game_status = "pause";
var player_x = 0;
var player_y = 0;

onmessage = function(event) {
    if (event.data[0] === "game_status") {
        game_status = event.data[1][0];
        console.log(game_status)
    } else if (event.data[0] === "player_move") {
        player_x = event.data[1][0];
        player_y = event.data[1][1];
    }
};

var x = 10;
var y = 10;
var min_x = 0
var min_y = 0
var max_x = 10;
var max_y = 10;
var name = "Bandit Archer";
var armor = 2;
var strength = 4;
var agility = 4;
var speed = 4;
var skills = [["shoots weakly", 5, 3, 50, 100]];
var loot = ["Bread", 100]
var sight = 3;
var range = 3;
var reset = 4;
var status = "move";
var attack= 0;
var attack_id = 0;

function mob_action() {
    if (game_status === "running") {
        if (status === "move") {
            move();
        } else if (status === "fight") {
            fight();
        } else if (status === "wait") {
            wait();
        }
    }
    setTimeout("mob_action()",300);
}

function move() {
    valid_move = []
    if (!(x<=min_x)) valid_move.push("left")
    if (!(x>=max_x)) valid_move.push("right")
    if (!(y<=min_x)) valid_move.push("up")
    if (!(y>=max_x)) valid_move.push("down")
    switch(valid_move[Math.floor(Math.random() * valid_move.length)]) {
        case "up":
            y = y - 1;
            break;
        case "down":
            y = y + 1
            break;
        case "left":
            x = x - 1;
            break;
        case "right":
            x = x + 1;
            break;
        default:
    }
    postMessage(["mob_move", [x, y, status]]);
    check_status();
}

function fight() {
    if (Math.abs(player_x - x) + Math.abs(player_y - y) > reset) {
        status = "wait";
        postMessage(["mob_msg", [name + " lost sight of you but is looking for you."]]);
    } else if (attack > 0) {
        attack = attack - 1;
    } else {
        dmg = 0;
        if (Math.floor(Math.random() * 100) <= skills[attack_id][3]) {
            dmg = Math.floor(Math.random() * skills[attack_id][2]);
            postMessage(["mob_fight", ["hp", dmg, name + " " + skills[attack_id][0] + " you for " + dmg + " damage."]]);
        } else postMessage(["mob_fight", ["hp", dmg, name + " " + skills[attack_id][0] + " at you but misses!"]]);

        attack_id = Math.floor(Math.random() * skills.length);
        attack = skills[attack_id][1];
    }
}

function wait() {
    if (Math.abs(player_x - x) + Math.abs(player_y - y) <= reset) {
        status = "fight";
        postMessage(["mob_msg", [name + " found you and is attacking again!"]]);
    } else if (wait < 5) {
        wait = wait + 1;
    }
    else {
        status = "move";
        postMessage(["mob_msg", [name + " is wondering around."]]);
    }
}

function check_status() {
    if (Math.abs(player_x - x) <= sight && Math.abs(player_y - y) <= sight) {
        status = "fight";
        attack_id = Math.floor(Math.random() * skills.length);
        attack = 0;
        wait = 0;
        postMessage(["mob_msg", [name + " found you and is attacking!"]]);
    }
}

mob_action();