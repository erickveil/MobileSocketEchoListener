.import "qrc:/dice.js" as Dice

var gameStateObj = {
    lastEncounter: {},
    numBosses: 0,
    isFinalBossEncountered: false,
    buttons: { loot: false },
    questBoss: null,
    questItem: null
}

function choseSpell() {
    let table = [
            "Bless",
            "Fireball",
            "Lightning Bolt",
            "Sleep",
            "Escape",
            "Protection"
        ];

    return Dice.getTableResult(table);
}

function choseTrap() {
    let table = [
            "Dart Trap (L2) on Random Character",
            "Poison Gas (L3) on All Characters",
            "Trapdoor (L4) on Lead Character",
            "Bear Trap (L4) on Lead Character",
            "Spear Trap (L5) on 2 Random Characters",
            "Falling Block Trap (L5) on Last Character"
        ];

    return Dice.getTableResult(table);
}

/**
  choseTreasure
  @brief Returns a random treasure reward.

  @attribute modifier int Default is 0. Modifies the table roll. If the modifier
  exceeds the bounds of the table, it will chose the highest or lowest table
  result, depending on if the modifier is positive or negative.

  @attribute hasMagic mixed If true (default) will chose a magic item on a roll
  of 6+. Otherwise, set to the thing that replaces the magic item by using a
  string or table result.
*/
function choseTreasure(modifier = 0, hasMagic = true) {

    let magicItem = (hasMagic === true) ? choseMagicItem() : hasMagic;
    let scroll = (hasMagic === true) ? "Scroll of " + choseSpell() : hasMagic;
    let table = [
            "No treasure found",
            Dice.roll(1, 6) + " gp",
            Dice.roll(2, 6) + " gp",
            scroll,
            "One gem worth " + (Dice.roll(2, 6) * 5) + " gp",
            "One jewelry piece worth " + (Dice.roll(3, 6) * 10) + " gp",
            magicItem
        ];
    return Dice.getTableResultWithModifier(table, modifier);
}

function choseMagicItem() {
    let table = [
            "Wand of Sleep (3 charges)",
            "Ring of Teleportation (1 charge)",
            "Fools Gold (1 charge)",
            "Magic " + choseMagicWeaponType() + " +1",
            "Potion of Healing",
            "Staff of Fireball (2 charges)",
        ]
    return Dice.getTableResult(table);
}

function choseMagicWeaponType() {
    let table = [
            "Light Mace",
            "Light Sword",
            "Heavy Warhammer",
            { result: "Heavy Sword", weight: 2 },
            "Bow"
        ];

    return Dice.getWeightedTableResult(table);
}

function choseVermin()
{
    let table = [
            {
                type: "Plague Rats",
                number: Dice.roll(3, 6),
                level: 1,
                loot: "No treasure found",
                special: "Infection: Lose 1 additional hp",
                reaction: "1-3 flee, 4-6 fight"
            },
            {
                type: "Stirges",
                number: Dice.roll(3, 6),
                level: 1,
                loot: "No treasure found",
                special: "Distraction: -1 to spell casting",
                reaction: "1-3 flee, 4-6 fight"
            },
            {
                type: "Kobolds",
                number: Dice.roll(2, 6),
                level: 3,
                loot: choseTreasure(-1),
                special: null,
                reaction: "1 flee, 2-3 flee if outnumbered, 4 bribe (5 gp " +
                          "per kobold)"
            },
            {
                type: "Giant Centipedes",
                number: Dice.roll(1, 6),
                level: 3,
                loot: null,
                special: "Poison: Save target 2 or lose 1 life",
                reaction: "1 flee, 2-3 flee if outnumbered, 4-6 fight"
            },
            {
                type: "Large Spiders",
                number: Dice.roll(1, 6),
                level: 4,
                loot: choseTreasure(-1),
                special: null,
                reaction: "1 flee, 2-4 fight, 5-6 fight to the death"
            },
            {
                type: "Skeletal Dogs",
                number: Dice.roll(2, 6),
                level: 3,
                loot: null,
                special: "Skeletal: +1 to blunt attacks, immune to ranged.",
                reaction: "1-2 flee, 3-6 fight"
            }
        ];
    return Dice.getTableResult(table);
}

function choseMinion() {
    let table = [
            {
                type: "Skeletons",
                number: Dice.roll(1, 6) + 2,
                level: 3,
                loot: null,
                special: "Skeletal: +1 to blunt attacks. -1 to arrows. " +
                         "Never test morale.",
                reaction: "Always fight to the death"
            },
            {
                type: "Zombies",
                number: Dice.roll(1,6),
                level: 3,
                loot: null,
                special: "-1 to arrow attacks. Never test morale.",
                reaction: "Always fight to the death"
            },
            {
                type: "Goblins",
                number: Dice.roll(1, 6) + 3,
                level: 3,
                loot: choseTreasure(-1),
                special: "Sneaky: 1 in 6 chance of gaining surprise. If " +
                         "they do not gain surprise, roll reaction " +
                         "immediately.",
                reaction: "1 flee if outnumbered, 2-3 bribe (5 gp per " +
                          "goblin), 4-6 fight.",
            },
            {
                type: "Hobgoblins",
                number: Dice.roll(1, 6) + 3,
                level: 4,
                loot: choseTreasure(1),
                special: null,
                reaction: "1 flee if outnumbered, 2-3 bribe (10 gp per " +
                          "hobgoblin), 4-5 fight, 6 fight to the death."
            },
            {
                type: "Orcs",
                number: Dice.roll(1, 6) + 1,
                level: 4,
                loot:
                choseTreasure(0, (Dice.roll(1, 6) * Dice.roll(1, 6)) + "gp" ),
                special: "Superstitious: Test morale each time one or more " +
                         "orcs are killed by a spell. -1 to morale if the " +
                         "spell caused their numbers to drop below 50%",
                reaction: "1-2 bribe (10 gp per orc), 3-5 fight, 6 fight to " +
                          "the death."
            },
            {
                type: "Trolls",
                number: Dice.roll(1, 3),
                level: 5,
                loot: choseTreasure(),
                special: "Regenerate: Roll for each killed troll on its " +
                         "next turn: On 5-6 it comes back to life. If " +
                         "killed with a spell, or one action spent " +
                         "chopping it to bits, the troll cannot regenerate.",
                reaction: "1-2 fight, 3-6 fight to the death. If a dwarf is " +
                          "present, will automatically fight to the death."
            },
            {
                type: "Shroomling",
                number: Dice.roll(2, 6),
                level: 3,
                loot: choseTreasure(),
                special: "Poisonous: If hit, save vs poison level 3 or lose " +
                         "1 life. Halflings add their level on the save.",
                reaction: "1-2 bribe (" + Dice.roll(1, 6) + " gp per " +
                          "Shroomling), 3-6 fight"
            }
        ];
    return Dice.getTableResult(table);
}

function choseBoss(hasDragon = true) {

    let table = [
            {
                type: "Mummy",
                level: 5,
                hp: 4,
                attacks: 2,
                lootMod: 2,
                lootHasMagic: true,
                lootRolls: 1,
                special: "Any character killed by a Mummy becomes another " +
                         "Mummy and must be fought by the party. Fireball " +
                         "attacks at +2. Never tests morale.",
                reaction: "Always fights to the death."
            },
            {
                type: "Orc Warlord",
                level: 5,
                hp: 5,
                attacks: 2,
                lootMod: 2,
                lootHasMagic: (Dice.roll(2, 6) * Dice.roll(1, 6) + "gp"),
                lootRolls: 1,
                special: null,
                reaction: "1 bribe (50 gp), 2-5 fight, 6 fight to the death."
            },
            {
                type: "Ogre",
                level: 5,
                hp: 6,
                attacks: 1,
                lootMod: 0,
                lootHasMagic: true,
                lootRolls: 1,
                special: "Heavy: Each hit inflicts 2 damage",
                reaction: "1 bribe (30 gp), 2-3 fight, 4-6 fight to the death."
            },
            {
                type: "Medusa",
                level: 4,
                hp: 4,
                attacks: 1,
                lootMod: 1,
                lootHasMagic: true,
                lootRolls: 1,
                special: "At the start of turn, party must save " +
                         "vs 4 or be turned to stone until a Bless is " +
                         "cast on them. Rogues add half their level to " +
                         "their save.",
                reaction: "1 bribe (" + Dice.roll(6, 6) +
                          " gp), 2 Quest, 3-5 fight, 6 fight to the death."
            },
            {
                type: "Chaos Warrior",
                level: 6,
                hp: 4,
                attacks: 3,
                lootMod: 1,
                lootHasMagic: true,
                lootRolls: 1,
                special: choseChaosPower() +
                         " When you kill the chaos warrior, roll d6: 5-6 " +
                         "find a Clue.",
                reaction: "1 flee if outnumbered, 2 fight, 3-6 fight to the " +
                          "death."
            }


        ];

    let dragon = getDragonObject();
    if (hasDragon) { table.push(dragon); }

    let roll = Dice.roll(1, table.length);
    let result = Dice.getTableResultAtIndex(table, roll, 1);

    // If we're on a quest for a boss, that boss is the next to come.
    let isOnBossQuest = gameStateObj.questBoss !== null;
    console.log("Is on boss quest? " + isOnBossQuest);
    if (isOnBossQuest) {
        result = gameStateObj.questBoss;
        console.log("Saved boss for quest: " + result.type);
    }

    result.isBoss = true;
    result.isFinalBoss = false;
    result.loot = getSubBossLootString(result);

    let bossRoll = Dice.roll(1, 6);
    let modifiedBossRoll = bossRoll + gameStateObj.numBosses;
    let isBossRollPassed = modifiedBossRoll >= 6;
    let isFinal = isBossRollPassed && (!(gameStateObj.isFinalBossEncountered));

    if (isFinal) {
        result = convertBossToFinalBoss(result);
    }

    return result;
}

function getSubBossLootString(bossObj)
{
    let lootString = "";

    for (var i = 0; i < bossObj.lootRolls; ++i) {
        lootString += choseTreasure(bossObj.lootMod, bossObj.lootHasMagic);
        let isLastItem = i >= bossObj.lootRolls - 1;
        let isSecondLastItem = i === bossObj.lootRolls - 2;
        if (isSecondLastItem) {
            lootString += ", and ";
            continue;
        }
        if (!isLastItem) {
            lootString += ", ";
        }
    }
    let isOnItemQuest = gameStateObj.questItem !== null;
    if (isOnItemQuest) {
        let hasItem = Dice.roll(1, 6) === 6;
        if (hasItem) {
            lootString = "Quest Item: " + gameStateObj.questItem + "!<br/>" +
                    lootString;
        }
    }

    return lootString;
}

function convertBossToFinalBoss(bossObj)
{
    // If it's already a final boss, don't modify it.
    if (bossObj.isFinalBoss === true) { return; }

    bossObj.hp++;
    bossObj.attacks++;
    bossObj.reaction = "Final Bosses fight to the death!"
    bossObj.loot = getFinalBossLootString(bossObj);
    bossObj.isFinalBoss = true;

    return bossObj;
}

function getFinalBossLootString(bossObj)
{
    let lootString = "";

    for (var i = 0; i < bossObj.lootRolls; ++i) {
        let choice =
            choseFinalBossTreasure(bossObj);
        lootString += choice;
        let isLastItem = i >= bossObj.lootRolls - 1;
        let isSecondLastItem = i === bossObj.lootRolls - 2;
        if (isSecondLastItem) {
            lootString += ", and ";
            continue;
        }
        if (!isLastItem) {
            lootString += ", ";
        }
    }

    let isOnItemQuest = gameStateObj.questItem !== null;
    if (isOnItemQuest) {
        let hasItem = Dice.roll(1, 6) === 6;
        if (hasItem) {
            lootString = "Quest Item: " + gameStateObj.questItem + "!<br/>" +
                    lootString;
        }
    }
    return lootString;
}

/**
  Used when explicitly pressing the final boss button
*/
function getAFinalBoss()
{
    let bossObj = choseBoss(true);
    bossObj = convertBossToFinalBoss(bossObj);
    gameStateObj.lastEncounter = bossObj;
    gameStateObj.numBosses++;
    gameStateObj.isFinalBossEncountered = true;

    return bossObj;
}

function choseFinalBossTreasure(bossObj)
{
    let magicItem = (bossObj.lootHasMagic === true)
        ? choseMagicItem()
        : bossObj.lootHasMagic;
    let magicItem2 = (bossObj.lootHasMagic === true)
        ? choseMagicItem()
        : bossObj.lootHasMagic;
    let scroll = (bossObj.lootHasMagic === true)
        ? "Scroll of " + choseSpell()
        : bossObj.lootHasMagic;
    let scroll2 = (bossObj.lootHasMagic === true)
        ? "Scroll of " + choseSpell()
        : bossObj.lootHasMagic;
    let gp1 = Dice.roll(1, 6) * 3;
    gp1 = gp1 > 100 ? gp1 : 100;
    let gp2 = Dice.roll(2, 6) * 3;
    gp2 = gp2 > 100 ? gp2 : 100;

    let table = [
            "No treasure found",
            gp1 + " gp",
            gp2 + " gp",
            "Scrolls: " + scroll + " and " + scroll2,
            "One gem worth " + (Dice.roll(2, 6) * 5) + " gp",
            "One jewelry piece worth " + (Dice.roll(3, 6) * 10) + " gp",
            "Magic Items: " + magicItem + " and " + magicItem2
        ];
    let result = Dice.getTableResultWithModifier(table, bossObj.lootMod);
    return result;

}

function getDragonObject() {
    let dragon = {
        type: "Dragon",
        level: 6,
        hp: 5,
        attacks: 2,
        lootMod: 1,
        lootHasMagic: true,
        lootRolls: 3,
        special: "Breaths fire on a 1-2: Party must save vs 6" +
             " (add half level) or take 1 damage. This is in " +
             "addition to its 2 attacks.",
        reaction: "1 Sleeping (all attacks +2 on first round), " +
              "2-3 bribe (all the party's gold, mimimum of 100 " +
              "gp or one magic item), 4-5 fight, 6 Quest."
    };

    let bossRoll = Dice.roll(1, 6);
    let modifiedBossRoll = bossRoll + gameStateObj.numBosses;
    let isBossRollPassed = modifiedBossRoll >= 6;
    let isFinal = isBossRollPassed && (!(gameStateObj.isFinalBossEncountered));

    if (isFinal) {
        dragon = convertBossToFinalBoss(dragon);
    }
    else {
        dragon.isFinalBoss = false;
        dragon.loot = getSubBossLootString(dragon);
    }

    return dragon;
}

function choseChaosPower() {
    let table = [
            { weight: 3, result: "No powers" },
            "Evil Eye: Save vs 4 or be at -1 on all defense rolls until " +
            "the creature is slain.",
            "Energy Drain: Each hit, Save vs 4 or lose 1 level",
            "Hellfire Blast: Before combat, Save vs 6 or lose 2 hp. Clerics " +
            "add half level to roll."
        ];
    return Dice.getWeightedTableResult(table);
}

function choseWeirdMonster() {
    let table = [
            {
                type: "Minotaur",
                level: 5,
                hp: 4,
                attacks: 2,
                loot: choseTreasure(),
                special: "Bull charge: First defense roll is -1. Attacks " +
                         "halflings first.",
                reaction: "1-2 bribe (60 gp), 3-4 fight, 6 fight to the death"
            },
            {
                type: "Rust Eater",
                level: 3,
                hp: 4,
                attacks: 3,
                loot: null,
                special: "No armor bonus from heavy armor. No damage on " +
                         "hit, but target loses (in order): armor, shield, " +
                         "main weapon, or 3d6 gp.",
                reaction: "1 flee, 2-3 bribe (" + Dice.roll(1, 6) + " gp " +
                          "to distract. Cannot use fools gold), 4-6 fight."
            },
            {
                type: "Chimera",
                level: 5,
                hp: 6,
                attacks: 3,
                loot: choseTreasure(),
                special: "Roll each turn: 1-2 breathes fire instead of " +
                         "attacking. Party must Save vs. 4 or lose 1 hp.",
                reaction: "1 bribe (50 gp), 2-6 fight"
            },
            {
                type: "Gorgon",
                level: 4,
                hp: 4,
                attacks: 1,
                loot: choseTreasure(1),
                special: "At start of battle, party must save vs 4 or " +
                         "lose 1 hp.",
                reaction: "1 flee, 2-6 fight"
            },
            {
                type: "Giant Spider",
                level: 5,
                hp: 3,
                attacks: 2,
                loot: choseTreasure() + " and " + choseTreasure(),
                special: "Poison: Save vs 3 on hit or lose 1 hp. Webs: " +
                         "Cannot flee from fight unless Fireball is cast " +
                         "to burn the webs.",
                reaction: "Always fights."
            },
            {
                type: "Gremlins",
                special: "Steal " + (Dice.roll(1, 6) + 3) + " objects " +
                         "from the party in this order: Magic items, " +
                         "scrolls, potions, weapons, gems, coins (in 10 gp " +
                         "increments). If all equipment is stolen, will " +
                         "leave a Clue. No XP roll."
            }

        ];
    return Dice.getTableResult(table);
}

function choseWanderingMonster(hasDragons = true)
{
    let table = [
            { weight: 2, result: choseVermin() },
            { weight: 2, result: choseMinion() },
            choseWeirdMonster(),
            choseBoss(hasDragons)
        ];
    let result = Dice.getWeightedTableResult(table);
    result.loot = "Wandering monsters don't carry loot.";
    gameStateObj.lastEncounter = result;
    return result;
}

function choseEpicReward()
{
    let bossObj = choseBoss();
    let bossName = bossObj.type;

    let table = [
            {
                name: "The Codex of Xirxiar",
                description: "The party is given the spell book that belonged to the legendary wizard Xirxiar. This counts as one scroll of each of the six spells. You may tear up the pages and distribute the six spells among the party to use as scrolls, or leave the book as it is and assign it to only one character. The book is old and fragile, and it is destroyed if the character carrying it is killed by dragon breath. If unused, the book may be sold for 650 gold pieces at the end of the adventure."
            },
            {
                name: "The Treasure of Droog",
                description: "The party is given the location of the treasure that belonged to a famous adventurer. As soon as the party searches a room and generates at least one clue, they may use that clue to find a hidden chest containing 500 gold pieces."
            },
            {
                name: "Enchanted Weapon",
                description: "One of the party’s weapons is enchanted and can now roll two dice for its Attack rolls, choosing the best result. The weapon can also hit monsters who are hit only by magic. The enchantment lasts until the end of the adventure."
            },
            {
                name: "Shield of Warning",
                description: "One of the party’s shields is now enchanted and counts as protection even if the user is surprised by wandering monsters or if the party is fleeing from a combat. If the party has no shields, they will be given one. The shield of warning is permanent, and will last throughout a campaign. It can be sold for 200 gold pieces."
            },
            {
                name: "Arrow of " + bossName + " Slaying",
                description: "The party is given an arrow that will automatically inflict 3 wounds upon a monster. The arrow only works against a " + bossName + ". The arrow may be used only by a character with a bow. It strikes automatically against its designed monster target. Once used, the arrow breaks. If unused, an arrow of slaying may be sold for 3d6 x 15 gold pieces."
            },
            {
                name: "Holy Symbol of Healing",
                description: "The party is given a holy symbol that may be used only by a cleric. The cleric will make all healing rolls at +2 until they die. When the cleric dies, the holy symbol can be bought to the cleric’s church. If the symbol and the body of the slain cleric are delivered to the church, an attempt to resurrect that cleric will be paid by the church. If unused, the holy symbol can be sold for 700 gold pieces."
            }
        ];
    return Dice.getTableResult(table);
}

function choseSearchResult()
{
    let table = [
            "<b>Wandering Monster!</b><br/>" +
            statblock(choseWanderingMonster()),
            { weight: 3, result: "<b>Empty</b> - Nothing found." },
            { weight: 2, result: "Find a Clue, Secret Door, or Hidden Treasure with Complication." }
        ];
    let result = Dice.getWeightedTableResult(table);
    return result;
}

function choseSpecialEvent()
{
    let table = [
            "A <b>ghost</b> passes through the party. All characters must save versus level 4 fear or lose 1 hp. A cleric adds their level to this roll.",

            "<b>Wandering monsters</b> attack the party. A boss monster met as a wandering monster has no chance of being the final boss.<br/>" + statblock(choseWanderingMonster(false)),

            "<b>A lady in white</b> appears and asks you to complete a quest. If you accept, roll on the Quest table. If you refuse, she disappears. Ignore any further appearances of the Lady in White in the game.",

            "<b>Trap!</b><br/>" + choseTrap(),

            "You meet a <b>wandering healer.</b> He will heal your party at the cost of 10 gold pieces per life healed. You may heal as many life points as you can afford. You can meet the healer only once per game. If you meet him again, reroll this result.",

            "You meet a <b>wandering alchemist.</b> He will sell you up to one potion of healing per party member (50 gp each) or a single dose of blade poison (30 gp). The potion of healing will heal all lost life points to a single character, and can be swallowed at any moment during the game as a free action. The blade poison lets you envenom a single arrow or slashing weapon (not a crushing weapon). That weapon will have a +1 on Attack against the first enemy you fight. Poison will not work on undead monsters, demons, blobs, automatons, or living statues. You can meet a wandering alchemist only once per game. If you meet him again, treat this result as a trap."
        ];
    return Dice.getTableResult(table);
}

function choseSpecialFeature()
{
    let statueGold = Dice.roll(3, 6) * 10;
    let table = [
            {
                name: "Fountain",
                description: "All wounded characters recover 1 Life the first time they encounter a fountain in an adventure. Further fountains have no effect."
            },
            {
                name: "Blessed Temple",
                description: "A character of your choice gains a +1 on Attack against undead monsters or demons. As soon as the character kills at least one undead or demon, the bonus is gone."
            },
            {
                name: "Armory",
                description: "All characters can change their weapons if they want, within the limits of the weapons allowed to their character type. For example, a Warrior who was using a sword and shield may discard his shield and take a two-handed weapon, or exchange his sword for a mace."
            },
            {
                name: "Cursed Altar",
                description: "As you enter the room, an eerie glow emanates from a sinister altar. A random character is cursed and has now -1 on his Defense rolls. To break the curse, the character must either slay a boss monster alone, or enter a Blessed Temple, or have a Blessing spell cast on himself by a cleric."
            },
            {
                name: "Statue",
                description: "You may leave the statue alone or touch it. " +
                             "If you touch it, roll d6. On a 1–3, the " +
                             "statue awakens and attacks your party (level 4 " +
                             "boss with 6 life points, immune to all spells; " +
                             "if you defeat it, you find " +
                             statueGold + " gp inside). On a " +
                             "4-6, the statue breaks, and you find " +
                             statueGold + " gold pieces inside"
            },
            {
                name: "Puzzle Room",
                description: "the room contains a puzzle box. Its level is d6. You may leave it alone or try to solve it. For every failed attempt, the character trying to solve it loses 1 life. Wizards and rogues add their level to their puzzle-solving roll. If the puzzle is solved, the box opens and it contains: " + choseTreasure()
            }
        ];
    return Dice.getTableResult(table);
}

function choseComplication()
{
    let table = [
            { weight: 2, result: "An alarm goes off, attracting wandering monsters to the room!<br/>" + statblock(choseWanderingMonster()) },

            { weight: 3, result: "The gold is protected by a level " + (Dice.roll(1, 3) + 2) + " trap. A rogue may try to disarm the trap. If you have no rogue, the trap attacks a random adventurer, inflicting 1 wound if he fails to save, and 2 wounds if he rolls a 1." },

            "A ghost (level " + (Dice.roll(1, 3) + 1) + ") protects the gold. A cleric may try to ban the ghost (roll d6 plus the cleric’s level; the ghost is destroyed if the cleric rolls a number equal to the ghost’s level or better). If there is no cleric in the party, or if the cleric fails to ban the ghost, all characters lose 1 life, and then the ghost disappears."
        ];
    return Dice.getWeightedTableResult(table);
}

function choseQuest() {
    let bossObj = choseBoss();

    // If already on a boss quest, the new quest will also use the same boss!
    let isOnBossQuest = gameStateObj.questBoss !== null;
    if (isOnBossQuest) { bossObj = gameStateObj.questBoss; }

    let bossName = bossObj.type;
    let magicItem = choseMagicItem();
    let goldValue = Dice.roll(1, 6) * 50;
    let table = [
            {
                name: "Bring Me His Head: " + bossName,
                description: "The creature asks the party to kill a " +
                             bossName + ". Killing the " + bossName + "and " +
                             "bringing its head to the creature’s room " +
                             "completes the quest."
            },
            {
                name: "Bring Me Gold: " + goldValue,
                description: "To complete the quest, the party must bring " +
                             goldValue + " gp worth of " +
                             "treasure to this room. If they already have " +
                             "that amount available, the amount required to " +
                             "complete the quest is doubled."
            },
            {
                name: "I Want Him Alive: " + bossName,
                description: "The creature asks the party to capture a " +
                             bossName + ". The party must subdue the " +
                             bossName + ", tie him up with a rope, and " +
                             "take him to the creature’s room to complete " +
                             "the quest. To subdue a monster, you must " +
                             "either use the Sleep spell or fight with -1 " +
                             "on all Attack rolls"
            },
            {
                name: "Bring Me: " + magicItem,
                description: "Bring a " + magicItem +" to this room where " +
                             "the quest started. Every time the party kills " +
                             "a boss, there is a 1 in 6 chance that he will " +
                             "have that object in addition to his treasure, " +
                             "if any."
            },
            {
                name: "Let Peace Be Your Way",
                description: "To complete the quest, the party must complete " +
                             "at least three encounters in the adventure in " +
                             "a non violent way. This includes reactions " +
                             "such as bribing, getting help from monsters, " +
                             "performing another quest (not this one!), " +
                             "or defeating a monster with the Sleep spell " +
                             "and then tying him up with a rope."
            },
            {
                name: "Slay All Monsters",
                description: "To complete the quest, all the dungeon rooms " +
                             "must be laid out and all the occupants slain, " +
                             "with the exception of the creature who sent " +
                             "the party on this quest. As soon as these " +
                             "conditions are met, the party can claim their " +
                             "reward."
            }
        ];
    let result = Dice.getTableResult(table);
    let isBossHunt = result.name.includes(bossName);
    if (isBossHunt) {
        gameStateObj.questBoss = bossObj;
        console.log("Quest started for: " + bossName);
    }
    return result;
}

function choseRoomContents() {
    let verminObj = choseVermin();
    let minionObj = choseMinion();
    let weirdObj = choseWeirdMonster();
    let bossObj = choseBoss();
    let featureObj = choseSpecialFeature();
    let dragonObj = getDragonObject();

    let table = [
            "<b>Treasure</b><p>" + choseTreasure() + "</p>",

            "<b>Treasure Protected By Trap</b><p>" + choseTrap() + "</p><p>" +
            choseTreasure() + "</p>",

            "<b>Special Event</b><p>" + choseSpecialEvent() + "</p>",

            "<b>Special Feature<p style='color: blue'>" + featureObj.name +
            "</p></b><p>" + featureObj.description + "</p>",

            "<b>Vermin</b>" + contentLoader.getVermin(),

            "<b>Minion</b>" + contentLoader.getMinion() + "<br/>+1 xp",

            "<b>Minion</b>" + contentLoader.getMinion() + "<br/>+1 xp",

            "<b>Empty</b><p>Can Search...</p>",

            "<b>Monster</b>" + contentLoader.getMonster() + "<br/>+10 xp",

            ( (bossObj.isFinalBoss)
                ? "<b>Final Boss!</b>"
                : "<b>Boss</b>") +
                contentLoader.getBoss() + "<br/>+10 xp",

            ( (dragonObj.isFinalBoss)
                ? "<b>Dragon's Lair - Final Boss!</b>"
                : "<b>Dragon's Lair</b>" ) +
                statblock(dragonObj) + "<br/>+10 xp"

        ];

    let numDice = 2;
    let index = Dice.roll(numDice, 6);

    let isVermin = (index === 6);
    let isMinion = (index === 7) || (index === 8);
    let isWeird = (index === 10);
    let isBoss = (index === 11);
    let isDragon = (index === 12);

    // set loot button state
    let isEncounter = isVermin || isMinion || isWeird || isBoss || isDragon;
    gameStateObj.buttons.loot = isEncounter;

    if (isVermin) { gameStateObj.lastEncounter = verminObj; }
    if (isMinion) { gameStateObj.lastEncounter = minionObj; }
    if (isWeird) { gameStateObj.lastEncounter = weirdObj; }
    if (isBoss) {
        gameStateObj.lastEncounter = bossObj;
        gameStateObj.numBosses++;
        if (bossObj.isFinalBoss) { gameStateObj.isFinalBossEncountered = true; }
        // Boss is chosen, reset quest boss.
        gameStateObj.questBoss = null;
    }
    if (isDragon) {
        gameStateObj.lastEncounter = dragonObj;
        gameStateObj.numBosses++;
        if (dragonObj.isFinalBoss) { gameStateObj.isFinalBossEncountered = true; }
    }

    let result = Dice.getTableResultAtIndex(table, index, numDice);

    // Set quest button state
    let isQuest = result.includes("Quest");
    gameStateObj.buttons.quest = isQuest;

    return result;
}

function choseCorridorContents() {
    let verminObj = choseVermin();
    let minionObj = choseMinion();
    let bossObj = choseBoss();
    let featureObj = choseSpecialFeature();

    let table = [
            "<b>Treasure</b><p>" + choseTreasure() + "</p>",

            "<b>Treasure Protected By Trap</b><p>" + choseTrap() + "</p><p>" +
            choseTreasure() + "</p>",

            "<b>Empty</b>",

            "<b>Special Feature<p style='color: blue'>" + featureObj.name +
            "</p></b><p>" + featureObj.description + "</p>",

            "<b>Vermin</b>" + contentLoader.getVermin(),

            "<b>Minion</b>" + contentLoader.getMinion() + "<br/>+1 xp",

            "<b>Empty</b>",

            "<b>Empty</b>",

            "<b>Empty</b>",

            ((bossObj.isFinalBoss) ? "<b>Final Boss!</b>" : "<b>Boss</b>") +
                contentLoader.getBoss() + "<br/>+10 xp",

            "<b>Empty</b>",
        ];

    let numDice = 2;
    let index = Dice.roll(numDice, 6);

    let isVermin = (index === 6);
    let isMinion = (index === 7);
    let isBoss = (index === 11);

    // Set loot button state
    let isEncounter = isVermin || isMinion || isBoss;
    gameStateObj.buttons.loot = isEncounter;

    if (isVermin) { gameStateObj.lastEncounter = verminObj; }
    if (isMinion) { gameStateObj.lastEncounter = minionObj; }
    if (isBoss) {
        gameStateObj.lastEncounter = bossObj;
        gameStateObj.numBosses++;
        if (bossObj.isFinalBoss) { gameStateObj.isFinalBossEncountered = true; }
        // Boss is chosen. Reset quest boss.
        gameStateObj.questBoss = null;
    }

    let result = Dice.getTableResultAtIndex(table, index, numDice);

    // Set quest button state
    let isQuest = result.includes("Quest");
    gameStateObj.buttons.quest = isQuest;

    return result;
}

function statblock(creatureObj) {
    let num = ("number" in creatureObj && creatureObj !== null)
        ? (creatureObj.number + " ") : "";
    let level = ("level" in creatureObj && creatureObj !== null)
        ? (creatureObj.level) : 1;
    let hp = ("hp" in creatureObj)
        ? (creatureObj.hp) : 1;
    let special = ("special" in creatureObj && creatureObj.special !== null )
        ? (creatureObj.special + "<br/>") : "";
    let attacks = ("attacks" in creatureObj && creatureObj.attacks !== null )
        ? (creatureObj.attacks) : "1";

    let block = "<div class='creatureBlock'><p>" +
        "<b style='color: #840000'> " +
        num + creatureObj.type + "</b></p><p>" +
        "Level: " + level + "<br/>" +
        "Hp: " + hp + "<br/>" +
        "Attacks: " + attacks + "<br/>" +
        special + "</p><p>" +
        "Reaction: " + creatureObj.reaction + "</p></div>";

    return block;
}

function getLastLoot()
{
    let lastEncObj = gameStateObj.lastEncounter;
    let lastType = lastEncObj.type;

    if (lastEncObj === null || lastType === null || lastType === undefined) {
        return "There has been no encounter yet.";
    }

    if (lastEncObj.loot === null) { return lastType + " does not carry loot."; }

    return  "<b>Loot</b><br/>" + lastEncObj.loot;
}
