function achievement ()
{
    actualise();
    clavier_diary = 1;

    Text = "";
    Text += "<a href='javascript:diary();'>Retour</a> <br/><br/>";

    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:50%;'>Nom</th> <th style='width:50%;'>Réalisation</th> </tr>";
    Text += "<tr> <td>Nombre de Pas</td> <td>" + Achiev_1 + "</td> </tr>";
    Text += "<tr> <td>Zones Découvertes</td> <td>" + Achiev_16 + "</td> </tr>";
    Text += "<tr> <td>Regions Découvertes</td> <td>" + Achiev_17 + "</td> </tr>";
    Text += "<tr> <td>Nuits Passées à l'Auberge</td> <td>" + Achiev_2 + "</td> </tr>";
    Text += "<tr> <td>Transactions à la Banque</td> <td>" + Achiev_3 + "</td> </tr>";
    Text += "<tr> <td>Ecus Gagnés</td> <td>" + Achiev_4 + "</td> </tr>";
    Text += "<tr> <td>Ecus Obtenus en Vente</td> <td>" + Achiev_5 + "</td> </tr>";
    Text += "<tr> <td>Ecus Obtenus en Butin</td> <td>" + Achiev_6 + "</td> </tr>";
    Text += "<tr> <td>Ecus Dépensés</td> <td>" + Achiev_7 + "</td> </tr>";
    Text += "<tr> <td>Objets Obtenus</td> <td>" + Achiev_8 + "</td> </tr>";
    Text += "<tr> <td>Objets Ramassés</td> <td>" + Achiev_9 + "</td> </tr>";
    Text += "<tr> <td>Objets Jetés</td> <td>" + Achiev_10 + "</td> </tr>";
    Text += "<tr> <td>Objets Fabriqués</td> <td>" + Achiev_11 + "</td> </tr>";
    Text += "<tr> <td>Objets Achetés</td> <td>" + Achiev_12 + "</td> </tr>";
    if (Achiev_12 > 0)
    {
        Text += "<tr> <td>Coût Moyen d'un Achat</td> <td>" + parseInt(Achiev_7/Achiev_12) + "</td> </tr>";
    }
    Text += "<tr> <td>Objets Vendus</td> <td>" + Achiev_13 + "</td> </tr>";
    if (Achiev_13 > 0)
    {
        Text += "<tr> <td>Revenu Moyen d'une Vente</td> <td>" + parseInt(Achiev_5/Achiev_13) + "</td> </tr>";
    }
    Text += "<tr> <td>Objets en Butins</td> <td>" + Achiev_14 + "</td> </tr>";
    Text += "<tr> <td>Monstres Tués</td> <td>" + Achiev_15 + "</td> </tr>";
    Text += "</table>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function actualise ()
{
    Music.play();
    clavier_game = clavier_zone = clavier_cave = clavier_character = clavier_equipment = clavier_inventory = clavier_skill = clavier_diary = clavier_map = clavier_save = clavier_option = clavier_option_home = 0;

    if (Player_Xp >= Player_Level*1000)
    {
        Player_Xp -=  Player_Level*1000;
        Player_Level++;
        Player_Skill_Max += 10;
        Player_Skill += 10;
    }

    statistique("Player","Life_Max",1,10);
    if (Player_Life > Player_Life_Max)
    {
        Player_Life = Player_Life_Max;
    }
    statistique("Player","Action_Max",0,0.01);
    if (Player_Action > Player_Action_Max)
    {
        Player_Action = Player_Action_Max;
    }
    statistique("Player","Stamina_Max",1,0.5);
    if (Player_Stamina > Player_Stamina_Max)
    {
        Player_Stamina = Player_Stamina_Max;
    }
    statistique("Player","Mana_Max",1,0.5);
    if (Player_Mana > Player_Mana_Max)
    {
        Player_Mana = Player_Mana_Max;
    }
    statistique("Player","Concentration_Max",1,0.5);
    if (Player_Concentration > Player_Concentration_Max)
    {
        Player_Concentration = Player_Concentration_Max;
    }

    statistique("Player","Physical_Attack",1,1);
    statistique("Player","Physical_Defense",1,1);
    statistique("Player","Physical_Dodge",0,1);
    statistique("Player","Physical_ResCritique",0,1);
    statistique("Player","Physical_Precision",0,1);
    statistique("Player","Physical_PreCritique",0,1);
    statistique("Player","Physical_DegCritique",0,1);
    statistique("Player","Magical_Attack",1,1);
    statistique("Player","Magical_Defense",1,1);
    statistique("Player","Magical_Dodge",0,1);
    statistique("Player","Magical_ResCritique",0,1);
    statistique("Player","Magical_Precision",0,1);
    statistique("Player","Magical_PreCritique",0,1);
    statistique("Player","Magical_DegCritique",0,1);
    statistique("Player","Distance_Attack",1,1);
    statistique("Player","Distance_Defense",1,1);
    statistique("Player","Distance_Dodge",0,1);
    statistique("Player","Distance_ResCritique",0,1);
    statistique("Player","Distance_Precision",0,1);
    statistique("Player","Distance_PreCritique",0,1);
    statistique("Player","Distance_DegCritique",0,1);
    statistique("Player","Speed",1,1);
    statistique("Player","Stockage_Max",1,1);
    Player_Stockage_Max += 999900*Debug;

    if (On_Battle == 1)
    {
        statistique_monster("Monster","Life_Max",1);
        if (Monster_Life > Monster_Life_Max)
        {
            Monster_Life = Monster_Life_Max;
        }
        Monster_Life_100 = parseInt((Monster_Life / Monster_Life_Max)*99) + 1;
        statistique_monster("Monster","Stamina_Max",1);
        if (Monster_Stamina > Monster_Stamina_Max)
        {
            Monster_Stamina = Monster_Stamina_Max;
        }
        statistique_monster("Monster","Mana_Max",1);
        if (Monster_Mana > Monster_Mana_Max)
        {
            Monster_Mana = Monster_Mana_Max;
        }
        statistique_monster("Monster","Concentration_Max",1);
        if (Monster_Concentration > Monster_Concentration_Max)
        {
            Monster_Concentration = Monster_Concentration_Max;
        }
        statistique_monster("Monster","Action_Max",0);
        if (Monster_Action > Monster_Action_Max)
        {
            Monster_Action = Monster_Action_Max;
        }

        statistique_monster("Monster","Physical_Attack",1);
        statistique_monster("Monster","Physical_Defense",1);
        statistique_monster("Monster","Physical_Dodge",0);
        statistique_monster("Monster","Physical_ResCritique",0);
        statistique_monster("Monster","Physical_Precision",0);
        statistique_monster("Monster","Physical_PreCritique",0);
        statistique_monster("Monster","Physical_DegCritique",0);
        statistique_monster("Monster","Magical_Attack",1);
        statistique_monster("Monster","Magical_Defense",1);
        statistique_monster("Monster","Magical_Dodge",0);
        statistique_monster("Monster","Magical_ResCritique",0);
        statistique_monster("Monster","Magical_Precision",0);
        statistique_monster("Monster","Magical_PreCritique",0);
        statistique_monster("Monster","Magical_DegCritique",0);
        statistique_monster("Monster","Distance_Attack",1);
        statistique_monster("Monster","Distance_Defense",1);
        statistique_monster("Monster","Distance_Dodge",0);
        statistique_monster("Monster","Distance_ResCritique",0);
        statistique_monster("Monster","Distance_Precision",0);
        statistique_monster("Monster","Distance_PreCritique",0);
        statistique_monster("Monster","Distance_DegCritique",0);
        statistique_monster("Monster","Speed",1);
    }
}

function addEvent (element, event, func)
{
	if (element.attachEvent)
	{
		return element.attachEvent('on' + event, func);
	}
	else
	{
		return element.addEventListener(event, func, false);
	}
}

function bank_give ()
{
    if (document.getElementById("saisie_money").value >= 0 && document.getElementById("saisie_money").value <= Player_Money_1)
    {
        Player_Money_1 -= parseInt(document.getElementById("saisie_money").value);
        Player_Money_1_Bank += parseInt(document.getElementById("saisie_money").value);
        Achiev_3++;

        pnj(1,2);
    }
}

function bank_take ()
{
    if (document.getElementById("saisie_money").value >= 0 && document.getElementById("saisie_money").value <= Player_Money_1_Bank)
    {
        Player_Money_1 += parseInt(document.getElementById("saisie_money").value);
        Player_Money_1_Bank -= parseInt(document.getElementById("saisie_money").value);
        Achiev_3++;

        pnj(1,2);
    }
}

function battle ()
{
    actualise();

    Text = "";
    Text = "<div style='text-align:right;margin-right:1%;'>";
    Text += eval("Monster_" + Monster_Id + "_Name") + " Niveau " + Monster_Level + "<br/>";
    progress("Vitalité","life",Monster_Life,Monster_Life_Max);
    Text += "<br/>";
    if (Monster_Statut_1 > 0)
    {
        Text += "Empoisonné (" + Monster_Statut_1 + " s restants) <br/>";
    }
    if (Monster_Statut_2 > 0)
    {
        Text += "Brûlé (" + Monster_Statut_2 + " s restants) <br/>";
    }
    if (Monster_Statut_3 > 0)
    {
        Text += "Malade (" + Monster_Statut_3 + " s restants) <br/>";
    }
    if (Monster_Statut_4 > 0)
    {
        Text += "Blessé (" + Monster_Statut_4 + " s restants) <br/>";
    }
    Text += "</div> <br/>";

    progress("Vitalité","life",Player_Life,Player_Life_Max);
    if (Player_Statut_1 > 0)
    {
        Text += "Empoisonné (" + Player_Statut_1 + " s restants) <br/>";
    }
    if (Player_Statut_2 > 0)
    {
        Text += "Brûlé (" + Player_Statut_2 + " s restants) <br/>";
    }
    if (Player_Statut_3 > 0)
    {
        Text += "Malade (" + Player_Statut_3 + " s restants) <br/>";
    }
    if (Player_Statut_4 > 0)
    {
        Text += "Blessé (" + Player_Statut_4 + " s restants) <br/>";
    }
    Text += "<br/>";
    progress("Energie","stamina",Player_Stamina,Player_Stamina_Max);
    progress("Mana","mana",Player_Mana,Player_Mana_Max);
    progress("Concentration","concentration",Player_Concentration,Player_Concentration_Max);
    progress("Actions","action",Player_Action,Player_Action_Max);
    Text += "<br/>";
    
    for (let id = 1; id <= Spell; id++)
    {
        if (eval("Spell_" + id + "_Level") == 1)
        {
            Text += "<a href='javascript:use_spell(" + id + ");'>" + eval("Spell_" + id + "_Name") + "</a> : ";
            spell_description(id);
            Text += "<br/>";
        }
    }

    Text += "<br/>";
    Text += "<a href='javascript:next_turn();'>Tour Suivant</a> <br/><br/>";

    for (let n=10;n>0;n--)
    {
        Text += eval("Result_" + n + "_Text") + "<br/>";
    }

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function battle_result (Name,id)
{
    for (let n=9;n>0;n--)
    {
        eval("Result_" + (n+1) + "_Text = '" + eval("Result_" + n + "_Text") + "'");
    }

    if (Name == "Player")
    {
        Result_1_Text = "Joueur utilise " + eval("Spell_" + id + "_Name");
    }
    else
    {
        Result_1_Text = eval("Monster_" + Monster_Id + "_Name") + " utilise " + eval("Spell_" + id + "_Name");
    }
}

function battle_win ()
{
    Music.pause();
    Music = new Audio('Music/Adventure.mp3');

    Text = "";
    Text += "Vous avez vaincu " + eval("Monster_" + Monster_Id + "_Name") + " niveau " + Monster_Level + "<br/><br/>";
    if (Player_Level <= Monster_Level)
    {
        Text += "+ " + eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Xp + "]")*(Monster_Level + 4) + " expérience <br/><br/>";
    }
    Text += "Butins :  <br/>";
    if (eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Money + "]") > 0)
    {
        Text += "+ " + eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Money + "]")*(Monster_Level + 4) + " Ecus <br/>";
    }
    for (let n=1;n<=eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Loot + "]");n++)
    {
        if (Math.random()*100 < eval("Monster_" + Monster_Id + "_Stat[" + eval("Monster_Stat_Loot_" + n) + "]"))
        {
            get_item(eval("Monster_" + Monster_Id + "_Stat[" + eval("Monster_Stat_Loot_" + n + "_Id") + "]"),Monster_Level,1);
            Text += "+ 1 " + eval("Item_" + eval("Monster_" + Monster_Id + "_Stat[" + eval("Monster_Stat_Loot_" + n + "_Id") + "]") + "_Name") + "<br/>";
            Achiev_14++;
        }
    }
    Text += "<br/>";
    Text += "<a href='javascript:game();'>Terminé</a>";

    document.getElementById("interface").innerHTML = Text;
}

function bestiary ()
{
    actualise();
    clavier_diary = 1;

    Text = "";
    Text += "<a href='javascript:diary();'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";

    if (Achiev_15 > 0)
    {
        Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:50%;'>Nom</th> <th style='width:50%;'>Tué</th> </tr>";
        for (let id=1;id<=Monster;id++)
        {
            if (eval("Monster_" + id + "_Kill") > 0)
            {
                Text += "<tr> <td>" + eval("Monster_" + id + "_Name") + "</td> <td>" + eval("Monster_" + id + "_Kill") + "</td> </tr>";
            }
        }
        Text += "</table>";
    }
    else
    {
        Text += "Vous n'avez tué aucun monstre";
    }

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function buy (id)
{
    price = eval("Item_" + id + "_Info[0]")*(eval(Biome_Text + "_Level") + 4);
    if (Player_Money_1 >= price)
    {
        Player_Money_1 -= price;
        Achiev_12++;
        Achiev_7 += price;
        get_item(id,eval(Biome_Text + "_Level"),1);
    }
}

function character ()
{
    actualise();
    clavier_character = 1;

    Text = "";
    Text += "<a href='javascript:game();'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";

    Text += Player_Name + ", " + eval("Race_" + Player_Race + "_Name") + " " + eval("Sexe_" + Player_Sexe + "_Name") + "<br/>";
    Text += "Niveau " + Player_Level + "<br/>";
    progress("Expérience","xp",Player_Xp,Player_Level*1000);
    
    for (let n=1;n<=Money;n++)
    {
        if (eval("Player_Money_" + n) > 0)
        {
            Text += eval("Money_" + n + "_Name") + " : " + eval("Player_Money_" + n) + "<br/>";
        }
    }
    Text += "<br/>";

    progress("Vitalité","life",Player_Life,Player_Life_Max);

    if (Player_Statut_1 > 0)
    {
        Text += "Empoisonné (" + Player_Statut_1 + " restants) <br/>";
    }
    if (Player_Statut_2 > 0)
    {
        Text += "Brûlé (" + Player_Statut_2 + " restants) <br/>";
    }
    if (Player_Statut_3 > 0)
    {
        Text += "Malade (" + Player_Statut_3 + " restants) <br/>";
    }
    if (Player_Statut_4 > 0)
    {
        Text += "Blessé (" + Player_Statut_4 + " restants) <br/>";
    }
    Text += "<br/>";
    progress("Energie","stamina",Player_Stamina,Player_Stamina_Max);
    progress("Mana","mana",Player_Mana,Player_Mana_Max);
    progress("Concentration","concentration",Player_Concentration,Player_Concentration_Max);
    Text += "<br/>";

    Text += "<u>Statistiques Physiques : </u> <br/>";
    Text += "Attaque : " + Player_Physical_Attack + "<br/>";
    Text += "Défense : " + Player_Physical_Defense + "<br/>";
    Text += "Esquive : " + Player_Physical_Dodge + "% <br/>";
    Text += "Protection : " + Player_Physical_ResCritique + "% <br/>";
    Text += "Précision : " + Player_Physical_Precision + "% <br/>";
    Text += "Chance : " + Player_Physical_PreCritique + "% <br/>";
    Text += "Critique : x " + Player_Physical_DegCritique + "% <br/><br/>";

    Text += "<u>Statistiques Magiques : </u> <br/>";
    Text += "Attaque : " + Player_Magical_Attack + "<br/>";
    Text += "Défense : " + Player_Magical_Defense + "<br/>";
    Text += "Esquive : " + Player_Magical_Dodge + "% <br/>";
    Text += "Protection : " + Player_Magical_ResCritique + "% <br/>";
    Text += "Précision : " + Player_Magical_Precision + "% <br/>";
    Text += "Chance : " + Player_Magical_PreCritique + "% <br/>";
    Text += "Critique : x " + Player_Magical_DegCritique + "% <br/><br/>";

    Text += "<u>Statistiques à Distance : </u> <br/>";
    Text += "Attaque : " + Player_Distance_Attack + "<br/>";
    Text += "Défense : " + Player_Distance_Defense + "<br/>";
    Text += "Esquive : " + Player_Distance_Dodge + "% <br/>";
    Text += "Protection : " + Player_Distance_ResCritique + "% <br/>";
    Text += "Précision : " + Player_Distance_Precision + "% <br/>";
    Text += "Chance : " + Player_Distance_PreCritique + "% <br/>";
    Text += "Critique : x " + Player_Distance_DegCritique + "% <br/><br/>";

    Text += "Actions : " + Player_Action_Max + "<br/>";
    Text += "Vitesse : " + Player_Speed + "<br/>";
    Text += "Stockage : " + Player_Stockage_Max + "<br/><br/>";

    Text += "<a href='javascript:skill();'>Répartir les Points de Caractéristiques</a>";
    if (Player_Skill > 0)
    {
        Text += " (" + Player_Skill + " points restants)";
    }

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function charge ()
{
    Text = "";
    Text += "<a href='javascript:home();'>Retour</a> <br/><br/>";
    Text += "<input id='charge' value='Insérez le code' onfocus='this.value=" + '""' + ";'></input> <br/>";
    Text += "<a href='javascript:charge_game();'>Lancer</a>";

    document.getElementById("interface").innerHTML = Text;
}

function charge_game ()
{
    Charge_Text = document.getElementById("charge").value;
    Charge = 0;
    Player_Name = "";
    Player_Race = "";
    Player_Sexe = "";
    Player_Level = "";
    Player_Xp = "";
    Player_Life = "";
    Player_Stamina = "";
    Player_Mana = "";
    Player_Concentration = "";
    Player_Money_1 = "";
    Player_Money_1_Bank = "";
    Player_Skill = "";
    Player_Skill_Max = "";
    Bag = "";
    Player_Stockage = 0;
    year = "";
    month = "";
    day = "";
    hour = "";
    minute = "";

    Debug = Charge_Text.substr(Charge,1);
    Charge += 2;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Name += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Race += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Race = parseInt(Player_Race);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Sexe += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Sexe = parseInt(Player_Sexe);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Level += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Level = parseInt(Player_Level);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Xp += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Xp = parseInt(Player_Xp);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Life += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Life = parseInt(Player_Life);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Stamina += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Stamina = parseInt(Player_Stamina);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Mana += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Mana = parseInt(Player_Mana);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Concentration += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Concentration = parseInt(Player_Concentration);
    Charge++;
    for (let n=1;n<=Statut;n++)
    {
        eval("Player_Statut_" + n + " = ''");
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Player_Statut_" + n + " += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Player_Statut_" + n + " = " + parseInt(eval("Player_Statut_" + n)));
        Charge++;
    }
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Money_1 += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Money_1 = parseInt(Player_Money_1);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Money_1_Bank += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Money_1_Bank = parseInt(Player_Money_1_Bank);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Skill += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Skill = parseInt(Player_Skill);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Player_Skill_Max += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Player_Skill_Max = parseInt(Player_Skill_Max);
    Charge++;
    for (let n=0;n<=Player_Stat;n++)
    {
        eval("Player_Skill_" + n + " = ''");
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Player_Skill_" + n + " += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Player_Skill_" + n + " = " + parseInt(eval("Player_Skill_" + n)));
        Charge++;
    }
    for (let n=1;n<=Achiev;n++)
    {
        eval("Achiev_" + n + " = ''");
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Achiev_" + n + " += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Achiev_" + n + " = " + parseInt(eval("Achiev_" + n)));
        Charge++;
    }
    for (let n=1;n<=Monster;n++)
    {
        eval("Monster_" + n + "_Kill = ''");
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Monster_" + n + "_Kill += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Monster_" + n + "_Kill = " + parseInt(eval("Monster_" + n + "_Kill")));
        Charge++;
    }
    for (let n=1;n<=11;n++)
    {
        eval("Player_Equip_" + n + "_Id = ''");
        eval("Player_Equip_" + n + "_Level = ''");
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Player_Equip_" + n + "_Id += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Player_Equip_" + n + "_Id = " + parseInt(eval("Player_Equip_" + n + "_Id")));
        Charge++;
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Player_Equip_" + n + "_Level += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Player_Equip_" + n + "_Level = " + parseInt(eval("Player_Equip_" + n + "_Level")));
        Charge++;
    }
    while (Charge_Text.substr(Charge,1) != "_")
    {
        Bag += Charge_Text.substr(Charge,1);
        Charge++;
    }
    Bag = parseInt(Bag);
    Charge++;
    for (let n=1;n<=Bag;n++)
    {
        eval("Bag_" + n + " = ''");
        eval("Bag_" + n + "_Id = ''");
        eval("Bag_" + n + "_Level = ''");
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Bag_" + n + " += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Bag_" + n + " = " + parseInt(eval("Bag_" + n)));
        Charge++;
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Bag_" + n + "_Id += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Bag_" + n + "_Id = " + parseInt(eval("Bag_" + n + "_Id")));
        Charge++;
        while (Charge_Text.substr(Charge,1) != "_")
        {
            eval("Bag_" + n + "_Level += " + Charge_Text.substr(Charge,1));
            Charge++;
        }
        eval("Bag_" + n + "_Level = " + parseInt(eval("Bag_" + n + "_Level")));
        Player_Stockage += eval("Bag_" + n)*eval("Item_" + eval("Bag_" + n + "_Id") + "_Info")[1];
        Charge++;
    }
    while (Charge_Text.substr(Charge,1) != "_")
    {
        year += Charge_Text.substr(Charge,1);
        Charge++;
    }
    year = parseInt(year);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        month += Charge_Text.substr(Charge,1);
        Charge++;
    }
    month = parseInt(month);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        day += Charge_Text.substr(Charge,1);
        Charge++;
    }
    day = parseInt(day);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        hour += Charge_Text.substr(Charge,1);
        Charge++;
    }
    hour = parseInt(hour);
    Charge++;
    while (Charge_Text.substr(Charge,1) != "_")
    {
        minute += Charge_Text.substr(Charge,1);
        Charge++;
    }
    minute = parseInt(minute);

    new_world();

    game();
}

function clavier (e)
{
	e = e || event;
	e.which = e.which || e.keyCode;
  
    keys[e.which] = e.type === 'keydown';
    
    if (clavier_game == 1)
    {
        if (keys[67]) 
        {
            character();
        }
        else if (keys[69])
        {
            equipment();
        }
        else if (keys[73])
        {
            inventory(0,0,0);
        }
        else if (keys[78])
        {
            spell();
        }
        else if (keys[74])
        {
            diary();
        }
        else if (keys[77])
        {
            map();
        }
        else if (keys[79])
        {
            option();
        }
        else if (keys[71])
        {
            save();
        }
    }
    
    if (clavier_zone == 1)
    {
        if (keys[38] || keys[90])
        {
            move(0,1,0,0,0,0);
        }
        else if (keys[40] || keys[83])
        {
            move(0,-1,0,0,0,0);
        }
        else if (keys[39] || keys[68])
        {
            move(1,0,0,0,0,0);
        }
        else if (keys[37] || keys[81])
        {
            move(-1,0,0,0,0,0);
        }
    }
    if (clavier_cave == 1)
    {
        if (keys[38] || keys[90])
        {
            move(0,0,1,0,eval("Biome_" + text_X + "_" + text_Y + "_" + text_Z + "_Type"));
        }
        else if (keys[40] || keys[83])
        {
            move(0,0,-1,0,eval("Biome_" + text_X + "_" + text_Y + "_" + text_Z + "_Type"));
        }
    }
    
    if (clavier_character == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_equipment == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_inventory == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_skill == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_diary == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_map == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_save == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_option == 1)
    {
        if (keys[27])
        {
            game();
        }
    }
    if (clavier_option_home == 1)
    {
        if (keys[27])
        {
            home();
        }
    }
}

function craft (resultat,ingredient,id_r1,quan_r1,id_r2,quan_r2,id_1,quan_1,id_2,quan_2,id_3,quan_3)
{
    if (eval("Item_" + id_1 + "_Level_" + Craft_Level) >= quan_1  && (ingredient < 2 || eval("Item_" + id_2 + "_Level_" + Craft_Level) >= quan_2)  && (ingredient < 3 || eval("Item_" + id_3 + "_Level_" + Craft_Level) >= quan_3))
    {
        get_item(id_1,Craft_Level,-quan_1);
        if (ingredient > 1)
        {
            get_item(id_2,Craft_Level,-quan_2);
            if (ingredient > 2)
            {
                get_item(id_3,Craft_Level,-quan_3);
            }
        }

        get_item(id_r1,Craft_Level,quan_r1);
        if (resultat > 1)
        {
            get_item(id_r2,Craft_Level,quan_r2);
        }

        Achiev_11++;

        station_craft();
    }
}

function diary ()
{
    actualise();
    clavier_diary = 1;

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";

    Text += "<a href='javascript:bestiary()'>Bestiaire</a> <br/>";
    Text += "<a href='javascript:achievement()'>Accomplissements</a>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function drop_item (id)
{
    get_item(eval("Bag_" + id + "_Id"),eval("Bag_" + id + "_Level"),-1);
    Achiev_10++;

    inventory(File,File2,File3);
}

function equip (id,slot)
{
    if (eval("Player_Equip_" + slot + "_Id") != 0)
    {
        get_item(eval("Player_Equip_" + slot + "_Id"),eval("Player_Equip_" + slot + "_Level"),1);
    }
    eval("Player_Equip_" + slot + "_Id =" + eval("Bag_" + id + "_Id"));
    eval("Player_Equip_" + slot + "_Level =" + eval("Bag_" + id + "_Level"));
    get_item(eval("Bag_" + id + "_Id"),eval("Bag_" + id + "_Level"),-1);

    inventory(File,File2,File3);
}

function equipment ()
{
    actualise();
    clavier_equipment = 1;

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:25%'>Partie</th> <th style='width:25%'>Nom</th> <th style='width:25%'>Niveau</th> <th style='width:25%'></th> </tr>";

    verify_equipment("Player",1,"Arme Droite","Rien");
    verify_equipment("Player",2,"Arme Gauche","Rien");
    verify_equipment("Player",3,"Couvre-Tête","Rien");
    verify_equipment("Player",11,"Dos","Rien");
    verify_equipment("Player",4,"Buste","Torse Nu");
    verify_equipment("Player",8,"Main Droite","Rien");
    verify_equipment("Player",9,"Main Gauche","Rien");
    verify_equipment("Player",10,"Taille","Rien");
    verify_equipment("Player",5,"Jambes","Nues");
    verify_equipment("Player",6,"Pied Droit","Pied Nu");
    verify_equipment("Player",7,"Pied Gauche","Pied Nu");

    Text += "</table>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function game ()
{
    actualise();
    clavier_game = 1;

    Text = "";
    Text += "X : " + X + ", Y : " + Y + " | " + eval("Biome_" + eval(Biome_Text + "_Type") + "_Name");
    if (b != 0)
    {
        Text += " ( " + eval("Building_" + b + "_Name") + " ) ";
    }
    Text += " | x : " + x + ", y : " + y + ", z : " + z + " | " + hour + " heure " + minute + ", " + day + " " + eval("Month_" + month + "_Name") + " an " + year + "<hr/>";
    Text += "<a href='javascript:character()'>Personnage</a> ";
    if (Touch_Help == 1)
    {
        Text += "(c) "
    }
    Text += "<a href='javascript:equipment()'>Equipement</a> ";
    if (Touch_Help == 1)
    {
        Text += "(e) "
    }
    Text += "<a href='javascript:inventory(0,0,0)'>Inventaire</a> ";
    if (Touch_Help == 1)
    {
        Text += "(i) "
    }
    Text += "<a href='javascript:spell()'>Compétences</a> ";
    if (Touch_Help == 1)
    {
        Text += "(n) "
    }
    Text += "<a href='javascript:diary()'>Journal</a> ";
    if (Touch_Help == 1)
    {
        Text += "(j) "
    }
    Text += "<a href='javascript:map()'>Carte</a> ";
    if (Touch_Help == 1)
    {
        Text += "(m) "
    }
    Text += "<a href='javascript:option()'>Options</a> ";
    if (Touch_Help == 1)
    {
        Text += "(o)"
    }
    Text += "<a href='javascript:save()'>Sauvegarde</a> ";
    if (Touch_Help == 1)
    {
        Text += "(g)"
    }
    Text += "<hr/> <center> <br/>";
    Text += "<table cellspacing='0' class='Minimap'>";

    Text + "<tr>";
    Text += "<td class='border_minimap'></td>";
    for (let id_x = (x - 5); id_x <= (x + 5); id_x++)
    {
        Text += "<td class='border_minimap'>" + id_x + "</td>";
    }
    Text += "<td class='border_minimap'></td>";
    Text + "</tr>";

    for (let id_y = (y + 5); id_y >= (y - 5); id_y--)
    {
        Text_y = id_y;
        if (id_y < 0)
        {
            Text_y = "n" + (-id_y);
        }
        Text += "<tr>";
        Text += "<td class='border_minimap'>" + id_y + "</td>";
        for (let id_x = (x - 5); id_x <= (x + 5); id_x++)
        {
            Text_x = id_x;
            if (id_x < 0)
            {
                Text_x = "n" + (-id_x);
            }

            Text += "<td ";
            if (id_x == x && id_y == y)
            {
                Text += "style='border:solid;border-color:red;' ";
            }
            if (eval("typeof Zone_" + Text_x + "_" + Text_y + "_" + text_z + "_0_Building") === 'undefined')
            {
                Text += "class='undefined_map'>?";
            }
            else if (eval("Zone_" + Text_x + "_" + Text_y + "_" + text_z + "_0_Building") == 0)
            {
                Text += "class='map'><span style='color:rgb(131, 103, 44);'>Rien</span>";
            }
            else
            {
                Text += "class='map'>" + eval("Building_" + eval("Zone_" + Text_x + "_" + Text_y + "_" + text_z + "_0_Building") + "_Name");
            }
            Text += "</td>";
        }
        Text += "<td class='border_minimap'>" + id_y + "</td>";
        Text += "</tr>";
    }

    Text + "<tr>";
    Text += "<td class='border_minimap'></td>";
    for (let id_x = (x - 5); id_x <= (x + 5); id_x++)
    {
        Text += "<td class='border_minimap'>" + id_x + "</td>";
    }
    Text += "<td class='border_minimap'></td>";
    Text + "</tr>";

    Text += "</table> <br/><br/>";

    Move_Text = "";
    Building_Text = "";
    Craft_Text = "";
    Item_Text = "";

    switch (b)
    {
        case 0:
            if (eval(Biome_Text + "_Type") >= 18)
            {   
                clavier_cave = 1;
                Move_Text += "<a href='javascript:move(0,0,1,";
                if (z == -1)
                {
                    switch (eval(Biome_Text + "_Type"))
                    {
                        case 18:
                            Move_Text += "35";
                            break;
                        case 19:
                            Move_Text += "36";
                            break;
                        case 20:
                            Move_Text += "37";
                            break;
                        case 21:
                            Move_Text += "38";
                            break;
                        case 22:
                            Move_Text += "39";
                            break;
                    }
                    Move_Text += ",1";
                }
                else
                {
                    Move_Text += "0,0";
                }
                Move_Text += ",0)'>Monter</a> <br/>";
                Move_Text += "<a href='javascript:move(0,0,-1,0,0,0)'>Descendre</a>";
            }
            else
            {
                clavier_zone = 1;
                Move_Text += "<a href='javascript:move(0,1,0,0,0,0)'>Nord</a> <br/>";
                Move_Text += "<a href='javascript:move(-1,0,0,0,0,0)'>Ouest</a> <a href='javascript:move(1,0,0,0,0,0)'>Est</a> <br/>";
                Move_Text += "<a href='javascript:move(0,-1,0,0,0,0)'>Sud</a>";

            }

            if (eval(Zone_Text + "_Building") > 0)
            {
                Building_Text += "<a href='javascript:move(0,0,0," + eval(Zone_Text + "_Building") + ",1,0)'> <img src='Picture/Icon_Building.png' class='icon'/>" + eval("Building_" + eval(Zone_Text + "_Building") + "_Name") + "</a>";
            }
            break;
        case 1:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,1,1,2,0)'>Monter</a> <br/>";
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(7)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_7_Name + "</a>";
                    break;
                case 2:
                    Move_Text += "<a href='javascript:move(0,0,-1,1,1,0)'>Descendre</a>";
                    break;
            }
            break;
        case 2:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 3:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(4)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_4_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(3)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_3_Name + "</a>";        
                    break;
            }
            break;
        case 4:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(6)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_6_Name + "</a>";        
                    break;
            }
            break;
        case 5:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(7)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_7_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(8)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_8_Name + "</a>";        
                    break;
            }
            break;
        case 6:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(8)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_8_Name + "</a>";        
                    break;
            }
            break;
        case 7:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(1)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_1_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(6)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_6_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(9)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_9_Name + "</a>";        
                    break;
            }
            break;
        case 8:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(2)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_2_Name + "</a>";        
                    break;
            }
            break;
        case 9:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,89,1,0,0,88,1)'> <img src='Picture/Icon_Item.png' class='icon'>" + Item_89_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 10:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,117,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_117_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 11:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 12:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(5)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_5_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(7)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_7_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(8)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_8_Name + "</a>";        
                    break;
            }
            break;
        case 13:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,89,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_89_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 14:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";   
                    break;
            }
            break;
        case 15:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";   
                    break;
            }
            break;
        case 16:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";      
                    break;
            }
            break;
        case 17:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,89,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_89_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 18:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(7)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_7_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(8)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_8_Name + "</a>";        
                    break;
            }
            break;
        case 19:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,89,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'> " + Item_89_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 20:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Move_Text += "<a href='javascript:move(0,0,-1,0,21)'>Descendre</a>";        
                    break;
            }
            break;
        case 21:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(7)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_7_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(8)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_8_Name + "</a>";        
                    break;
            }
            break;
        case 22:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,117,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_117_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 23:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    if (eval("typeof Item_88_Level_" + eval("Biome_" + text_X + "_" + text_Y + "_" + text_Z + "_Level")) === 'undefined')
                    {
                        eval("Item_88_Level_" + eval("Biome_" + text_X + "_" + text_Y + "_" + text_Z + "_Level") + " = " + 0);
                    }
                    if (eval("Item_88_Level_" + eval("Biome_" + text_X + "_" + text_Y + "_" + text_Z + "_Level")) > 0)
                    {
                        Item_Text += "<a href='javascript:get_loot_zone(9)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_9_Name + " ( nécessite " + Item_88_Name + " ) </a>";
                    }        
                    break;
            }
            break;
        case 24:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:get_loot_zone(123)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_123_Name + "</a>";        
                    break;
            }
            break;
        case 25:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:get_loot_zone(118)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_118_Name + "</a>";
                    Item_Text += "<a href='javascript:get_loot_zone(120)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_120_Name + "</a>";        
                    break;
            }
            break;
        case 26:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";      
                    break;
            }
            break;
        case 27:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(5)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_5_Name + "</a>";        
                    break;
            }
            break;
        case 28:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,89,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_89_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 29:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 30:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 31:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";    
                    break;
            }
            break;
        case 32:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 33:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 34:
            switch (r)
            {
                case 1:
                    Craft_Level = eval(Biome_Text + "_Level");
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:craft(1,1,90,1,0,0,88,1)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_90_Name + "</a> ( nécessite " + Item_88_Name + " )";        
                    break;
            }
            break;
        case 35:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0)'>Sortir</a> <br/>";
                    Move_Text += "<a href='javascript:move(0,0,-1,0,0,18)'>Descendre</a>";        
                    break;
            }
            break;
        case 36:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0)'>Sortir</a> <br/>";
                    Move_Text += "<a href='javascript:move(0,0,-1,0,0,19)'>Descendre</a>";        
                    break;
            }
            break;
        case 37:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0)'>Sortir</a> <br/>";
                    Move_Text += "<a href='javascript:move(0,0,-1,0,0,20)'>Descendre</a>";        
                    break;
            }
            break;
        case 38:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0)'>Sortir</a> <br/>";
                    Move_Text += "<a href='javascript:move(0,0,-1,0,0,21)'>Descendre</a>";        
                    break;
            }
            break;
        case 39:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0)'>Sortir</a> <br/>";
                    Move_Text += "<a href='javascript:move(0,0,-1,0,0,22)'>Descendre</a>";
                    break;
            }
            break;
        case 40:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";    
                    break;
            }
            break;
        case 41:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:get_loot_zone(124)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_124_Name + "</a>";     
                    break;
            }
            break;
        case 42:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 43:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
        case 44:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:get_loot_zone(84)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_84_Name + "</a>";        
                    break;
            }
            break;
        case 45:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Item_Text += "<a href='javascript:get_loot_zone(87)'><img src='Picture/Icon_Item.png' class='icon'>" + Item_87_Name + "</a>";        
                    break;
            }
            break;
        case 46:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";     
                    break;
            }
            break;
        case 47:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(10)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_10_Name + "</a> <br/>";        
                    break;
            }
            break;
        case 48:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(10)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_10_Name + "</a> <br/>";
                    Craft_Text += "<a href='javascript:new_station_craft(11)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_11_Name + "</a>";  
                    break;
            }
            break;
        case 49:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    Craft_Text += "<a href='javascript:new_station_craft(11)'><img src='Picture/Icon_Craft.png' class='icon'>" + Craft_Station_11_Name + "</a>";        
                    break;
            }
            break;
        case 50:
            switch (r)
            {
                case 1:
                    Move_Text += "<a href='javascript:move(0,0,0,0,0,0)'>Sortir</a>";
                    break;
            }
            break;
    }

    Text += Move_Text + "</center>";
    if (Building_Text != "")
    {
        Text += Building_Text + "<br/><br/>";
    }
    if (eval(Zone_Text + "_PNJ") > 0)
    {
        for (let n=1;n<=eval(Zone_Text + "_PNJ");n++)
        {
            Text += "<a href='javascript:pnj(" + n + ",1)'> <img src='Picture/Icon_Pnj.png' class='icon'>" + eval("PNJ_" + eval(Zone_Text + "_PNJ_" + n + "_Work") + "_Work") + "</a>, " + eval("Race_" + eval(Zone_Text + "_PNJ_" + n + "_Race") + "_Name") + " " + eval("Sexe_" + eval(Zone_Text + "_PNJ_" + n + "_Sexe") + "_Name") + "<br/>";
        }
        Text += "<br/>";
    }
    if (eval(Zone_Text + "_Monster") > 0)
    {
        for (let n=1;n<=eval(Zone_Text + "_Monster");n++)
        {
            Text += "<a href='javascript:new_battle(" + eval(Zone_Text + "_Monster_" + n + "_Id") + "," + n + ")'> <img src='Picture/Icon_Monster.png' class='icon'>" + eval("Monster_" + eval(Zone_Text + "_Monster_" + n + "_Id") + "_Name") + "</a> <br/>";
        }
        Text += "<br/>";
    }
    if (Craft_Text != "")
    {
        Text += Craft_Text + "<br/><br/>";
    }
    Text += Item_Text;
    for (let n=1;n<=eval(Zone_Text + "_Item");n++)
    {
        Text += "<a href='javascript:get_loot_zone(" + eval(Zone_Text + "_Item_" + n + "_Id") + ")'> <img src='Picture/Icon_Item.png' class='icon'>" + eval("Item_" + eval(Zone_Text + "_Item_" + n + "_Id") + "_Name") + "</a> <br/>";
    }

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function game_over ()
{
    Music.pause();

    Text = "";
    Text += "Vous êtes morts... <br/><br/>";
    Text += "<a href='javascript:home()'>Retour à l'Ecran Titre</a>";

    document.getElementById("interface").innerHTML = Text;
}

function get_item (id,level,quan)
{
    Bag_Exist = 0;
    for (let n=1;n<=Bag;n++)
    {
        if (eval("Bag_" + n + "_Id") == id && eval("Bag_" + n + "_Level") == level)
        {
            Bag_Exist = n;
        }
    }

    if (Bag_Exist > 0)
    {
        eval("Bag_" + Bag_Exist + " = " + (eval("Bag_" + Bag_Exist) + quan));
        eval("Item_" + id + "_Level_" + level + " = " + (eval("Item_" + id + "_Level_" + level) + quan));

        if (eval("Bag_" + Bag_Exist) == 0 && Bag >= 2)
        {
            for (let n=Bag_Exist;n<Bag;n++)
            {
                eval("Bag_" + n + " = " + eval("Bag_" + (n + 1)));
                eval("Bag_" + n + "_Id = " + eval("Bag_" + (n + 1) + "_Id"));
                eval("Bag_" + n + "_Level = " + eval("Bag_" + (n + 1) + "_Level"));
            }
            Bag--;
        }
        else if (eval("Bag_" + Bag_Exist) == 0)
        {
            Bag--;
        }
    }
    else
    {
        Bag++;
        eval("Bag_" + Bag + " = " + quan);
        eval("Bag_" + Bag + "_Id = " + id);
        eval("Bag_" + Bag + "_Level = " + level);
        eval("Item_" + id + "_Level_" + level + "=" + quan);
    }

    Player_Stockage += quan*eval("Item_" + id + "_Info")[1];
    Achiev_8 += quan;
}

function get_loot_zone (id)
{
    if (eval("Item_" + id + "_Info")[1] + Player_Stockage <= Player_Stockage_Max)
    {
        eval(Zone_Text + "_Item--");
        eval(Zone_Text + "_Item_1_Quan = " + 0);
        get_item(id,eval(Biome_Text + "_Level"),1);
        Achiev_9++;

        game();
    }
}

function help (id1,id2)
{
    Text = "";
    switch (id1)
    {
        case 0:
            Text += "<a href='javascript:home()'>Retour</a> <br/><br/>";
            Text += "<a href='javascript:help(1,0)'>Statistiques</a> <br/>";
            Text += "<a href='javascript:help(2,0)'>Combat</a>";
            break;
        case 1:
            switch (id2)
            {
                case 0:
                    Text += "<a href='javascript:help(0,0)'>Retour</a> <br/><br/>";
                    Text += "<a href='javascript:help(1,1)'>Catégories</a> <br/>";
                    Text += "<a href='javascript:help(1,2)'>Combat</a> <br/>";
                    Text += "<a href='javascript:help(1,3)'>Autres</a> <br/>";
                    Text += "<a href='javascript:help(1,4)'>Points de Caractéristiques</a>";
                    break;
                case 1:
                    Text += "<a href='javascript:help(1,0)'>Retour</a> <br/><br/>";
                    Text += "Les statistiques se divisent en 4 catégories : <br/>";
                    Text += "Les statistiques <b>physiques</b> qui s'appliquent en cas de combat de mélée. <br/>";
                    Text += "Les statistiques <b>à distance</b> qui s'appliquent en cas de combat à distance. <br/>";
                    Text += "Les statistiques <b>magiques</b> qui s'appliquent en cas d'utilisation de sorts. <br/>";
                    Text += "Les <b>autres</b> statistiques qui s'appliquent en permanence (Vitalité,Vitesse,Stockage,Actions) ou de manière beaucoup plus occasionelles. <br/><br/>";
                    Text += "Les 3 premières catégories sont composées des mêmes statistiques et sont appelées <b>statistiques de combat<b/>. Il est à noter que certaine statistiques sont cruciales en combat mais ne sont pas des <b>statistiques de combat<b/> car elles servent aussi en dehors.";
                    break;
                case 2:
                    Text += "<a href='javascript:help(1,0)'>Retour</a> <br/><br/>";
                    Text += "Les statistiques de combat peuvent se classer en 2 types distincts : <br/><br/>";
                    Text += "Les statistiques <b>offensives</b> qui servent à infliger des dommages à votre adversaire. Elles peuvent être améliorées en portant des armes. <br/>";
                    Text += "L'<b>Attaque</b> détermine les dégats de base qu'infligeront vos compétences. <br/>";
                    Text += "La <b>Précision</b> détermine votre chance de toucher votre cible. <br/>";
                    Text += "La <b>Chance</b> est le pourcentage de faire un coup critique : plus est elle est élevée, plus les coups critiques seront fréquents. Attention il ne s'agit pas exactement de votre chance de faire un coup critique car votre chance de toucher votre adversaire n'est pas forcement de 100% ! <br/>";
                    Text += "Le <b>Critique</b> détermine les dégats qu'infligeront vos coups critiques par rapport à un coup ordinaire. <br/><br/>";
                    Text += "Les statistiques <b>défensives</b> qui servent à limiter voir éviter les dommages subis. Elles peuvent être améliorées en portant des pièces d'armures ou un bouclier. <br/>";
                    Text += "La <b>Défense</b> limite directement le montant des dégats. Les pièces d'armures lourdes augmentent fortement la Défense. <br/>";
                    Text += "L'<b>Esquive</b> permet d'ignorer une attaque. Les pièces d'armures légères augmentent fortement l'Esquive. <br/><br/>";
                    Text += "Il existe egalement une jauge différente pour chaque type de compétences. Elles servent à lancer des compétences en se vidant selon la puissance de la compétence. Elles se régénèrent automatiquement au cours du temps. <br/>";
                    Text += "L'<b>Energie</b> pour les compétences physiques. <br/>";
                    Text += "La <b>Concentration</b> pour les comptétences à distance. <br/>";
                    Text += "La <b>Mana</b> pour les compétences magiques.";
                    break;
                case 3:
                    Text += "<a href='javascript:help(1,0)'>Retour</a> <br/><br/>";
                    Text += "En plus des statistiques de combat, votre personnage est caractérisé par d'autres statistiques : <br/>";
                    Text += "La <b>Vitalité</b> est la statistique la plus importante de votre personnage. Vous devez la maintenir le plus haut possible car si elle arrive à 0, c'est la mort définitive. <br/>";
                    Text += "Le <b>Stockage</b> est votre capacité à porter un plus grand nombre d'objet. <br/>";
                    Text += "La <b>Vitesse</b> ne sert à rien.";
                    break;
                case 4:
                    Text += "<a href='javascript:help(1,0)'>Retour</a> <br/><br/>";
                    Text += "A chaque fois que votre personnage gagne un niveau, il gagne également 10 points de caractéristiques. Ces points peuvent être répartis entre les différentes statistiques de base pour renforcer votre personnage selon votre style de jeu. <br/>";
                    Text += "Ces points servent à spécialiser votre personnage et sont essentiels dans la rehouabilité de Js-RPG. Essayer plusieurs combinaison selon votre équipement, vos compétences et votre style.";
                    break;
            }
            break;
        case 2:
            switch (id2)
            {
                case 0:
                    Text += "<a href='javascript:help(0,0)'>Retour</a> <br/><br/>";
                    Text += "<a href='javascript:help(2,1)'>Monstres</a>";
                    break;
                case 1:
                    Text += "<a href='javascript:help(2,0)'>Retour</a> <br/><br/>";
                    Text += "Lorsque vous vous déplacerez sur la carte, des monstres peuvent apparaître. Il ne peut y avoir qu'un seul monstre dans chaque zone et un monstre ne quittera sa zone que si il meure. <br/>";
                    Text += "En cliquant sur un monstre, vous déclencherez un combat contre lui. Les monstres ne peuvent pas déclencher de combat par eux-mêmes. <br/>";
                    Text += "Vous avez toujours l'initiative lors d'un combat, c'est à dire que vous commencez toujours à jouer en premier.";
                    break;
            }
            break;
    }
    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function home ()
{
    Music = new Audio('Music/Menu.mp3');
    Music.play();
    clavier_game = clavier_zone = clavier_cave = clavier_character = clavier_equipment = clavier_inventory = clavier_skill = clavier_diary = clavier_map = clavier_save = clavier_option = clavier_option_home = 0;
    addEvent(window, "keydown", clavier);
    addEvent(window, "keyup", clavier);

    Text = "";
    Text += "<center> JsRPG <br/><br/>";
    Text += "<a href='javascript:charge()'>Charger une Partie</a> <br/>";
    Text += "<a href='javascript:select_race(0)'>Nouvelle Partie</a> <br/>";
    if (Debugger == 1)
    {
        Text += "<a href='javascript:select_race(1)'>Nouvelle Partie (Mode Debug)</a> <br/>";
    }
    Text += "<a href='javascript:option_home()'>Options</a> <br/>";
    Text += "<a href='javascript:help(0)'>Tutoriel</a>";
    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function inventory (file,file2,file3)
{
    actualise();
    clavier_inventory = 1;
    find_result = 0;
    File = file;
    File2 = file2;
    File3 = file3;

    for (let id=1;id<=Bag;id++)
    {
        slot = eval("Bag_" + id + "_Id");
        eval("var Bag_" + id + "_Result = " + 0);
        if ((File == 0) || (File == 1 && eval("Item_" + slot + "_Info[2]") == 0 && eval("Item_" + slot + "_Info[4]") == 0) || (File == 2 && eval("Item_" + slot + "_Info[2]") == 1) || (File == 3 && File2 == 0 && File3 == 0 && eval("Item_" + slot + "_Info[4]") > 0) || (File == 3 && File2 == 1 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 1) || (File == 3 && File2 == 1 && File3 == 1 && eval("Item_" + slot + "_Info[4]") == 1 && eval("Item_" + slot + "_Info[5]") == 1) || (File == 3 && File2 == 1 && File3 == 2 && eval("Item_" + slot + "_Info[4]") == 1 && eval("Item_" + slot + "_Info[5]") == 2) || (File == 3 && File2 == 1 && File3 == 3 && eval("Item_" + slot + "_Info[4]") == 1 && eval("Item_" + slot + "_Info[5]") == 3) || (File == 3 && File2 == 1 && File3 == 4 && eval("Item_" + slot + "_Info[4]") == 1 && eval("Item_" + slot + "_Info[5]") == 4) || (File == 3 && File2 == 2 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 4) || (File == 3 && File2 == 3 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 5) || (File == 3 && File2 == 8 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 11) || (File == 3 && File2 == 4 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 6) || (File == 3 && File2 == 7 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 10) || (File == 3 && File2 == 5 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 8) || (File == 3 && File2 == 6 && File3 == 0 && eval("Item_" + slot + "_Info[4]") == 3))
        {
            eval("Bag_" + id + "_Result = " + 1);
            find_result++;
        }
    }

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    progress("Stockage","stockage",Player_Stockage,Player_Stockage_Max);
    Text += "<br/>";
    Text += "<a href='javascript:inventory(0,0,0)'>Tous</a> <a href='javascript:inventory(1,0,0)'>Matériaux</a> <a href='javascript:inventory(2,0,0)'>Utilisables</a> <a href='javascript:inventory(3,0,0)'>Equipements</a> <br/>"
    if (File == 3)
    {
        Text += "<a href='javascript:inventory(3,1,0)'>Armes</a> <a href='javascript:inventory(3,6,0)'>Tête</a> <a href='javascript:inventory(3,8,0)'>Dos</a> <a href='javascript:inventory(3,2,0)'>Bustes</a> <a href='javascript:inventory(3,5,0)'>Mains</a> <a href='javascript:inventory(3,7,0)'>Taille</a> <a href='javascript:inventory(3,3,0)'>Jambes</a> <a href='javascript:inventory(3,4,0)'>Pieds</a> <br/>";
        if (File2 == 1)
        {
            Text += "<a href='javascript:inventory(3,1,1)'>Epées</a> <a href='javascript:inventory(3,1,2)'>Baguettes</a> <a href='javascript:inventory(3,1,3)'>Arcs</a> <a href='javascript:inventory(3,1,4)'>Boucliers</a> <br/>";
        }
    }
    if (find_result > 0)
    {
        Text += "<i>" + find_result + " résultats</i> <br/><br/>";
        Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:12%;'>Obtenu</th> <th style='width:12%;'>Nom</th> <th style='width:12%;'>Niveau</th> <th style='width:12%;'>Poids Unitaire</th> <th style='width:12%;'>Poids Total</th> <th style='width:12%;'></th> <th style='width:12%;'></th> <th style='width:12%;'></th> </tr>";
        
        for (let id=1;id<=Bag;id++)
        {
            slot = eval("Bag_" + id + "_Id");
            if (eval("Bag_" + id + "_Result") == 1)
            {
                Text += "<tr> <td>" + eval("Bag_" + id) + "</td> <td>" + eval("Item_" + slot + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> <td>" + eval("Item_" + slot + "_Info[1]") + "</td> <td>" + eval("Item_" + slot + "_Info[1]")*eval("Bag_" + id) + "</td> <td><a href='javascript:drop_item(" + id + ")'>Jeter</a></td>";

                if (eval("Item_" + slot + "_Info[2]") == 1)
                {
                    Text += "<td><a href='javascript:use_item(" + id + ")'>" + eval("Use_" + eval("Item_" + slot + "_Info[3]") + "_Name") + "</a></td>";
                }

                if (eval("Item_" + slot + "_Info[4]") > 0)
                {
                    Text += "<td><a href='javascript:select_equip(" + id + ")'>Equiper</a></td>";
                }

                Text += "</tr>";
            }
        }
        Text += "</table>";
    }
    else
    {
        Text += "<center><i>Aucun résultat</i></center>";
    }

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function list_spell (User,Target,id)
{
    Result = 1;
    Damage_Physical = Damage_Magical = Damage_Distance = Degat_Physical = Degat_Magical = Degat_Distance = Hit_Physical = Hit_Magical = Hit_Distance = User_Life = User_Action = User_Stamina = User_Mana = User_Concentration = 0;

    if (id == 1 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 2 && eval(User + "_Action") >= 2 && eval(User + "_Mana") >= 1)
    {
        User_Action = -2;
        User_Concentration = -1;
        Hit_Magical = 1;
        Damage_Magical = eval(User + "_Magical_Attack");
    }
    else if (id == 3 && eval(User + "_Action") >= 2 && eval(User + "_Concentration") >= 1)
    {
        User_Action = -2;
        User_Concentration = -1;
        Hit_Distance = 1;
        Damage_Distance = eval(User + "_Distance_Attack");
    }
    else if (id == 4 && eval(User + "_Action") >= 3 && eval(User + "_Mana") >= 5)
    {
        User_Action = -2;
        User_Mana = -5;
        User_Life = 250;
    }
    else if (id == 5 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 6 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 7 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 8 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 9 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 10 && eval(User + "_Action") >= 3 && eval(User + "_Mana") >= 5)
    {
        User_Action = -3;
        User_Mana = -5;
        User_Life = parseInt(eval(User + "_Life_Max")*0.2);
    }
    else if (id == 11 && eval(User + "_Action") >= 3 && eval(User + "_Stamina") >= 5)
    {
        User_Action = -3;
        User_Stamina = -5;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack")*1.5);
    }
    else if (id == 12 && eval(User + "_Action") >= 3 && eval(User + "_Mana") >= 5)
    {
        User_Action = -3;
        User_Mana = -5;
        Hit_Magical = 1;
        Damage_Magical = parseInt(eval(User + "_Magical_Attack")*1.5);
    }
    else if (id == 13 && eval(User + "_Action") >= 3 && eval(User + "_Concentration") >= 5)
    {
        User_Action = -3;
        User_Concentration = -5;
        Hit_Distance = 1;
        Damage_Distance = parseInt(eval(User + "_Distance_Attack")*1.5);
    }
    else if (id == 14 && eval(User + "_Action") >= 3 && eval(User + "_Stamina") >= 5 && Player_Money_1 >= 10)
    {
        User_Action = -3;
        User_Stamina = -5;
        Player_Money_1_Drop = 10 + parseInt(Math.random()*20);
        if (Player_Money_1 < Player_Money_1_Drop)
        {
            Player_Money_1_Drop = Player_Money_1;
        }
        Player_Money_1 = Player_Money_1 - Player_Money_1_Drop;
        Hit_Physical = 1;
        Damage_Physical = parseInt(Player_Money_1_Drop*(9.95 + Math.random()*0.1));
    }
    else if (id == 15 && eval(User + "_Action") >= 3 && eval(User + "_Concentration") >= 5 && Player_Money_1 >= 10)
    {
        User_Action = -3;
        User_Concentration = -5;
        Player_Money_1_Drop = 10 + parseInt(Math.random()*20);
        if (Player_Money_1 < Player_Money_1_Drop)
        {
            Player_Money_1_Drop = Player_Money_1;
        }
        Player_Money_1 = Player_Money_1 - Player_Money_1_Drop;
        Hit_Distance = 1;
        Damage_Distance = parseInt(Player_Money_1_Drop*(9.95 + Math.random()*0.1));
    }
    else if (id == 16 && eval(User + "_Action") >= 3 && eval(User + "_Stamina") >= 5)
    {
        User_Action = -3;
        User_Stamina = -5;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack")*1.5);
    }
    else if (id == 17 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 1)
    {
        User_Action = -2;
        User_Stamina = -1;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
    }
    else if (id == 18 && eval(User + "_Action") >= 3 && eval(User + "_Stamina") >= 5)
    {
        User_Action = -3;
        User_Stamina = -5;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack")*1.5);
    }
    else if (id == 19 && eval(User + "_Action") >= 3 && eval(User + "_Mana") >= 20)
    {
        User_Action = -5;
        User_Mana = -20;
        Hit_Magical = 1;
        Damage_Magical = parseInt(eval(User + "_Magical_Attack")*3);
    }
    else if (id == 20 && eval(User + "_Action") >= 2 && eval(User + "_Mana") >= 3)
    {
        User_Action = -2;
        User_Mana = -3;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Magical_Attack");
    }
    else if (id == 21 && eval(User + "_Action") >= 3 && eval(User + "_Mana") >= 5)
    {
        User_Action = -3;
        User_Mana = -5;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Magical_Attack")*1.5);
    }
    else if (id == 22 && eval(User + "_Action") >= 2 && eval(User + "_Concentration") >= 3)
    {
        User_Action = -2;
        User_Concentration = -3;
        Hit_Magical = 1;
        Damage_Magical = eval(User + "_Distance_Attack");
    }
    else if (id == 23 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 3)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Magical = 1;
        Damage_Magical = eval(User + "_Physical_Attack");
    }
    else if (id == 24 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 3)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Physical = 1;
        Damage_Physical = eval(User + "_Physical_Attack");
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_1 += " + 4);
        }
    }
    else if (id == 25 && eval(User + "_Action") >= 2 && eval(User + "_Concentration") >= 3)
    {
        User_Action = -2;
        User_Concentration = -3;
        Hit_Distance = 1;
        Damage_Distance = eval(User + "_Distance_Attack");
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_1 += " + 4);
        }
    }
    else if (id == 26 && eval(User + "_Action") >= 2 && eval(User + "_Mana") >= 3)
    {
        User_Action = -2;
        User_Mana = -3;
        Hit_Magical = 1;
        Damage_Magical = eval(User + "_Magical_Attack");
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_2 += " + 4);
        }
    }
    else if (id == 27 && eval(User + "_Action") >= 3 && eval(User + "_Mana") >= 8)
    {
        User_Action = -3;
        User_Mana = -8;
        Hit_Magical = 1;
        Damage_Magical = parseInt(eval(User + "_Magical_Attack")*1.5);
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_2 += " + 4);
        }
    }
    else if (id == 28 && eval(User + "_Action") >= 5 && eval(User + "_Mana") >= 12)
    {
        User_Action = -5;
        User_Mana = -12;
        Hit_Magical = 1;
        Damage_Magical = parseInt(eval(User + "_Magical_Attack")*2);
        if (Math.random()*100 < 50)
        {
            eval(Target + "_Statut_ += " + 4);
        }
    }
    else if (id == 29 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 3)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack"));
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_1 += " + 4);
        }
    }
    else if (id == 30 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 3)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack"));
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_2 += " + 4);
        }
    }
    else if (id == 31 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 3)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack"));
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_1 += " + 4);
        }
    }
    else if (id == 32 && eval(User + "_Action") >= 2 && eval(User + "_Stamina") >= 3)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack"));
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_2 += " + 4);
        }
    }
    else if (id == 33 && eval(User + "_Action") >= 3 && eval(User + "_Stamina") >= 5)
    {
        User_Action = -3;
        User_Stamina = -5;
        User_Life = parseInt(eval(User + "_Life_Max")*0.2);
    }
    else if (id == 34 && eval(User + "_Action") >= 3 && eval(User + "_Stamina") >= 5)
    {
        User_Action = -2;
        User_Stamina = -3;
        Hit_Physical = 1;
        Damage_Physical = parseInt(eval(User + "_Physical_Attack"));
        if (Math.random()*100 < 33)
        {
            eval(Target + "_Statut_3 += " + 4);
        }
    }
    else
    {
        Result = 0;
    }

    if (Result == 1)
    {
        for (let n = 0; n < Hit_Physical; n++)
        {
            if (eval(User + "_Physical_Precision") >= Math.random()*100 + eval(Target + "_Physical_Dodge"))
            {
                Dommage_Physical = Damage_Physical;

                if (eval(User + "_Physical_PreCritique") - eval(Target + "_Physical_ResCritique") >= Math.random()*100)
                {
                    Dommage_Physical = parseInt(Dommage_Physical*(eval(User + "_Physical_DegCritique")/100));
                }

                if (Dommage_Physical >= eval(Target + "_Physical_Defense"))
                {
                    Degat_Physical += parseInt((Dommage_Physical - eval(Target + "_Physical_Defense"))*(0.95 + Math.random()*0.1));
                }
                else
                {
                    Degat_Physical += 1;
                }
            }
        }

        for (let n = 0; n < Hit_Magical; n++)
        {
            if (eval(User + "_Magical_Precision") >= Math.random()*100 + eval(Target + "_Magical_Dodge"))
            {
                Dommage_Magical = Damage_Magical;

                if (eval(User + "_Magical_PreCritique") - eval(Target + "_Magical_ResCritique") >= Math.random()*100)
                {
                    Dommage_Magical = parseInt(Dommage_Magical*(eval(User + "_Magical_DegCritique")/100));
                }

                if (Dommage_Magical >= eval(Target + "_Magical_Defense"))
                {
                    Degat_Magical += parseInt((Dommage_Magical - eval(Target + "_Magical_Defense"))*(0.95 + Math.random()*0.1));
                }
                else
                {
                    Degat_Magical += 1;
                }
            }
        }

        for (let n = 0; n < Hit_Distance; n++)
        {
            Dommage_Distance = Damage_Distance;

            if (eval(User + "_Distance_PreCritique") - eval(Target + "_Distance_DesCritique") >= Math.random()*100 + eval(Target + "_Distance_Dodge"))
            {
                Dommage_Distance = parseInt(Dommage_Distance*(eval(User + "_Distance_DegCritique")/100));
            }
        
            if (eval(User + "_Distance_Precision") >= Math.random()*100)
            {
                if (Dommage_Distance >= eval(Target + "_Distance_Attack"))
                {
                    Degat_Distance += parseInt((Dommage_Distance - eval(Target + "_Distance_Defense"))*(0.95 + Math.random()*0.1));
                }
                else
                {
                    Degat_Distance += 1;
                }
            }
        }

        eval(User + "_Life += " + User_Life);
        eval(User + "_Action += " + User_Action);
        eval(User + "_Stamina += " + User_Stamina);
        eval(User + "_Mana += " + User_Mana);
        eval(User + "_Concentration += " + User_Concentration);
        eval(Target + "_Life += " + (-Degat_Physical - Degat_Magical - Degat_Distance));

        if (eval(User + "_Statut_4") > 0)
        {
            eval(User + "_Statut_4--");
            eval(User + "_Life -= " + parseInt(eval(User + "_Life_Max")*0.05));
        }

        battle_result(User,id);
    }
}

function map ()
{
    actualise();
    clavier_map = 1;

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/> <center>";
    Text += "<a href='javascript:world_map()'>Carte du Monde</a> <br/><br/>";
    Text += "X : " + X + " | Y : " + Y + "<br/>";
    Text += eval("Biome_" + eval(Biome_Text + "_Type") + "_Name") + "<br/><br/>";
    Text += "<table cellspacing='0' class='Map'>";

    start_x = X*25;
    end_x = (X + 1)*25 - 1;
    start_y = (Y + 1)*25 - 1;
    end_y = Y*25;

    Text + "<tr>";
    Text += "<td class='border_map'></td>";
    for (let id_x = start_x; id_x <= end_x; id_x++)
    {
        Text += "<td class='border_map'>" + id_x + "</td>";
    }
    Text += "<td class='border_map'></td>";
    Text + "</tr>";

    for (let id_y = start_y; id_y >= end_y; id_y--)
    {
        Text_y = id_y;
        if (id_y < 0)
        {
            Text_y = "n" + (-id_y);
        }
        Text += "<tr>";
        Text += "<td class='border_map'>" + id_y + "</td>";
        for (let id_x = start_x; id_x <= end_x; id_x++)
        {
            Text_x = id_x;
            if (id_x < 0)
            {
                Text_x = "n" + (-id_x);
            }

            Text += "<td ";
            if (id_x == x && id_y == y)
            {
                Text += "style='border:solid;border-color:red;' ";
            }
            if (eval("typeof Zone_" + Text_x + "_" + Text_y + "_" + text_z + "_" + r + "_Building") === 'undefined')
            {
                Text += "class='undefined_map'>?";
            }
            else if (eval("Zone_" + Text_x + "_" + Text_y + "_" + text_z + "_" + r + "_Building") == 0)
            {
                Text += "class='map'><span style='color:rgb(131, 103, 44);'>Rien</span>";
            }
            else
            {
                Text += "class='map'>" + eval("Building_" + eval("Zone_" + Text_x + "_" + Text_y + "_" + text_z + "_" + r + "_Building") + "_Name");
            }
            Text += "</td>";
        }
        Text += "<td class='border_map'>" + id_y + "</td>";
        Text += "</tr>";
    }

    Text + "<tr>";
    Text += "<td class='border_map'></td>";
    for (let id_x = start_x; id_x <= end_x; id_x++)
    {
        Text += "<td class='border_map'>" + id_x + "</td>";
    }
    Text += "<td class='border_map'></td>";
    Text + "</tr>";

    Text += "</table> </center>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function move (new_x,new_y,new_z,new_b,new_r,new_biome)
{
    x = x + new_x;
    text_x = x;
    y = y + new_y;
    text_y = y;
    z = z + new_z;
    text_z = z;
    b = new_b;
    r = new_r;

    X = parseInt(x/25);
    Y = parseInt(y/25);
    if (z >= 0)
    {
        Z = 1;
    }
    else if (z < 0)
    {
        Z = -1;
    }
    text_X = X;
    text_Y = Y;
    text_Z = Z;

    if (x < 0)
    {
        text_x = "n" + (-x);
    }

    if (X < 0 || (X == 0 && x < 0))
    {
        text_X = "n" + (-X + 1);
        X = X - 1;
    }

    if (y < 0)
    {
        text_y = "n" + (-y);
    }

    if (Y < 0 || (Y == 0 && y < 0))
    {
        text_Y = "n" + (-Y + 1);
        Y = Y - 1;
    }

    if (z < 0)
    {
        text_z = "n" + (-z);
        text_Z = "n" + (-Z);
    }

    Zone_Text = "Zone_" + text_x + "_" + text_y + "_" + text_z + "_" + r;
    Biome_Text = "Biome_" + text_X + "_" + text_Y + "_" + text_Z;

    if (eval("typeof " + Zone_Text + "_Building") === 'undefined')
    {
        new_zone(new_biome);
    }

    if (b == 0)
    {
        if (eval(Zone_Text + "_Item") == 0)
        {
            Zone_Loot_1 = Math.floor(eval("List_Loot_Id_Biome_" + eval(Biome_Text + "_Type")).length*Math.random());
            eval(Zone_Text + "_Item_1_Quan = " + 0);
            eval(Zone_Text + "_Item_1_Id = " + eval("List_Loot_Id_Biome_" + eval(Biome_Text + "_Type"))[Zone_Loot_1]);
            if (Math.random()*100 < eval("List_Loot_Stat_Biome_" + eval(Biome_Text + "_Type"))[Zone_Loot_1])
            {
                eval(Zone_Text + "_Item++");
                eval(Zone_Text + "_Item_1_Quan = " + 1);
            }
        }

        if (eval(Zone_Text + "_Monster") == 0)
        {
            Zone_Monster_1 = Math.floor(eval("List_Monster_Id_Biome_" + eval(Biome_Text + "_Type")).length*Math.random());
            eval(Zone_Text + "_Monster_1_Id = " + 0);
            if (Math.random()*100 < eval("List_Monster_Stat_Biome_" + eval(Biome_Text + "_Type"))[Zone_Monster_1])
            {
                eval(Zone_Text + "_Monster++");
                eval(Zone_Text + "_Monster_1_Id = " + eval("List_Monster_Id_Biome_" + eval(Biome_Text + "_Type"))[Zone_Monster_1]);
            }
        }
    }

    Achiev_1++;

    time(5);

    if (new_b == 0)
    {
        Sound = new Audio('Music/Walk.mp3');
        Sound.play();
    }

    game();
}

function next_turn ()
{
    Result_Text = "";

    Monster_Action = Monster_Action_Max;
    Monster_Stamina += 1;
    Monster_Mana += 1;
    Monster_Concentration += 1;

    if (Monster_Statut_1 > 0)
    {
        Monster_Statut_1--;
        Monster_Life -= parseInt(Monster_Life_Max*0.1);
    }
    if (Monster_Statut_2 > 0)
    {
        Monster_Statut_2--;
        Monster_Life -= parseInt(Monster_Life_Max*0.1);
    }
    if (Monster_Statut_3 > 0)
    {
        Monster_Statut_3--;
        Monster_Life -= parseInt(Monster_Life_Max*0.1);
    }

    while (Monster_Action >= 2 && (Monster_Stamina >= 1 || Monster_Mana >= 1|| Monster_Concentration >= 1))
    {
        list_spell("Monster","Player",eval("Monster_" + Monster_Id + "_Spell[Math.floor(Monster_" + Monster_Id + "_Spell.length*Math.random())]"));
        if (Monster_Statut_4 > 0)
        {
            Monster_Statut_4--;
            Monster_Life -= parseInt(Monster_Life_Max*0.1);
        }
    }

    Player_Action = Player_Action_Max;
    time(5);

    battle();
}

function new_battle (id,slot)
{
    On_Battle = 1;
    Player_Action = Player_Action_Max;

    Monster_Id = id;
    Monster_Slot = slot;
    Monster_Level = eval(Biome_Text + "_Level");
    Monster_Life = eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Life_Max + "]")*(Monster_Level + 4);
    Monster_Stamina = eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Stamina_Max + "]")*(Monster_Level + 4);
    Monster_Mana = eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Mana_Max + "]")*(Monster_Level + 4);
    Monster_Concentration = eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Concentration_Max + "]")*(Monster_Level + 4);
    Monster_Action = eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Action_Max + "]");
    Monster_Statut_1 = Monster_Statut_2 = Monster_Statut_3 = Monster_Statut_4 = 0;

    for (let n=1;n<=10;n++)
    {
        eval("Result_" + n + "_Text = ''");
    }

    Music.pause();
    Music = new Audio('Music/Battle' + parseInt(Math.random()*3 + 1) + '.mp3');

    battle();
}

function new_game ()
{
    Player_Level = 1;
    Player_Xp = 0;
    Player_Money_1 = 1000000*Debug;
    Player_Money_1_Bank = 0;
    Player_Skill = 10;
    Player_Skill_Max = 10;
    for (let n=0;n<=Player_Stat;n++)
    {
        eval("Player_Skill_" + n + " = " + 0);
    }
    for (let n=1;n<=Achiev;n++)
    {
        eval("Achiev_" + n + " = " + 0);
    }
    Achiev_8 = 4;
    Achiev_16 = 1;
    Achiev_17 = 4;
    for (let n=1;n<=Monster;n++)
    {
        eval("Monster_" + n + "_Kill = " + 0);
    }

    Player_Equip_1_Id = 0;
    Player_Equip_1_Level = 1;
    Player_Equip_2_Id = 0;
    Player_Equip_2_Level = 1;
    Player_Equip_3_Id = 0;
    Player_Equip_3_Level = 1;
    Player_Equip_4_Id = 274;
    Player_Equip_4_Level = 1;
    Player_Equip_5_Id = 276;
    Player_Equip_5_Level = 1;
    Player_Equip_6_Id = 278;
    Player_Equip_6_Level = 1;
    Player_Equip_7_Id = 278;
    Player_Equip_7_Level = 1;
    Player_Equip_8_Id = 0;
    Player_Equip_8_Level = 1;
    Player_Equip_9_Id = 0;
    Player_Equip_9_Level = 1;
    Player_Equip_10_Id = 0;
    Player_Equip_10_Level = 1;
    Player_Equip_11_Id = 0;
    Player_Equip_11_Level = 1;

    statistique("Player","Life_Max",1,10);
    Player_Life = Player_Life_Max;
    statistique("Player","Stamina_Max",1,0.5);
    Player_Stamina = Player_Stamina_Max;
    statistique("Player","Mana_Max",1,0.5);
    Player_Mana = Player_Mana_Max;
    statistique("Player","Concentration_Max",1,0.5);
    Player_Concentration = Player_Concentration_Max;

    for (let n=1;n<=Statut;n++)
    {
        eval("Player_Statut_" + n + " = " + 0);
    }

    Bag = 0;
    Player_Stockage = 0;
    if (Debug == 1)
    {
        for (let id=1;id<=Item;id++)
        {
            get_item(id,1,10);
        }
    }

    minute = 0;
    hour = 8;
    day = 1;
    month = 6;
    year = 0;

    new_world();

    game();
}

function new_pnj (work)
{
    var PNJ = Zone_Text + "_PNJ";
    eval(PNJ + "++");
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Work = " + work);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Sexe = " + parseInt(Math.random()*2 + 1));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Race = " + parseInt(Math.random()*11 + 1));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_1_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_1_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_2_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_2_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Id = " + 274);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Id = " + 276);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Level = " + eval(Biome_Text + "_Level"));
    if (eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Sexe") == 2)
    {
        eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Id = " + 337);
        eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Id = " + 0);
    }
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_6_Id = " + 278);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_6_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_7_Id = " + 278);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_7_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_8_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_8_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_9_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_9_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_10_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_10_Level = " + eval(Biome_Text + "_Level"));
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_11_Id = " + 0);
    eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_11_Level = " + eval(Biome_Text + "_Level"));
    switch (work)
    {
        case 5:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Id = " + 275);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Id = " + 277);
            if (eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Sexe") == 2)
            {
                eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Id = " + 338);
                eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Id = " + 0);
            }
            break;
        case 6:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 342);
            break;
        case 7:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_1_Id = " + 348);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 349);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Id = " + 282);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Id = " + 293);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_6_Id = " + 304);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_7_Id = " + 304);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_8_Id = " + 315);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_9_Id = " + 315);
            break;
        case 10:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_4_Id = " + 339);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_5_Id = " + 0);
            break;
        case 11:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 336);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_8_Id = " + 313);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_9_Id = " + 313);
            break;
        case 12:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 336);
            break;
        case 13:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 342);
            break;
        case 16:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_3_Id = " + 328);
            break;
        case 17:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_1_Id = " + 351);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_8_Id = " + 312);
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_9_Id = " + 312);
            break;
        case 18:
            eval(Zone_Text + "_PNJ_" + eval(Zone_Text + "_PNJ") + "_Equip_1_Id = " + 350);
            break;
    }
}

function new_name ()
{
    Player_Name = document.getElementById("new_name").value;

    select_player();
}

function new_race (id)
{
    Player_Race = id;

    select_sexe();
}

function new_sexe (id)
{
    Player_Sexe = id;

    select_name();
}

function new_station_craft (id)
{
    Craft = id;
    Craft_Level = Player_Level;

    station_craft();
}

function new_world ()
{
    statistique("Player","Action_Max",0,0.1);
    Player_Action = Player_Action_Max;

    for (let id=1;id<=Spell;id++)
    {
        eval("Spell_" + id + "_Level = " + 0);
    }
    Spell_1_Level = 1;
    Spell_2_Level = 1;
    Spell_3_Level = 1;
    Spell_4_Level = 1;

    x = y = z = b = r = X = Y = Z = 0;
    text_x = x;
    text_y = y;
    text_z = z;

    X = parseInt(x/25);
    Y = parseInt(y/25);
    if (z >= 0)
    {
        Z = 1;
    }
    else if (z < 0)
    {
        Z = -1;
    }
    text_X = X;
    text_Y = Y;
    text_Z = Z;

    if (x < 0)
    {
        text_x = "n" + (-x);
    }

    if (X < 0 || (X == 0 && x < 0))
    {
        text_X = "n" + (-X + 1);
    }

    if (y < 0)
    {
        text_y = "n" + (-y);
    }

    if (Y < 0 || (Y == 0 && y < 0))
    {
        text_Y = "n" + (-Y + 1);
    }

    if (z < 0)
    {
        text_z = "n" + (-z);
    }

    if (Z < 0)
    {
        text_Z = "n" + (-Z);
    }

    Biome_0_0_1_Type = Biome_n1_0_1_Type = Biome_0_n1_1_Type = Biome_n1_n1_1_Type = 1;
    Biome_0_0_1_Level = Biome_n1_0_1_Level = Biome_0_n1_1_Level = Biome_n1_n1_1_Level = 1;
    List_Start_Biome = new Array("Biome_0_0_1_Type", "Biome_n1_0_1_Type", "Biome_0_n1_1_Type", "Biome_n1_n1_1_Type");
    eval(List_Start_Biome[Math.floor(List_Start_Biome.length*Math.random())] + " = " + 12);
    if (Biome_0_0_1_Type == 12)
    {
        eval("Zone_" + x + "_" + y + "_" + z + "_" + r + "_Building = " + 1);
    }
    else
    {
        eval("Zone_" + x + "_" + y + "_" + z + "_" + r + "_Building = " + 0);
    }

    Zone_Text = "Zone_" + text_x + "_" + text_y + "_" + text_z + "_" + r;
    Biome_Text = "Biome_" + text_X + "_" + text_Y + "_" + text_Z;

    eval(Zone_Text + "_PNJ = " + 0);
    eval(Zone_Text + "_Monster = " + 0);
    eval(Zone_Text + "_Item = " + 0);
    
    if (eval(Zone_Text + "_Item") == 0)
    {
        Zone_Loot_1 = Math.floor(eval("List_Loot_Id_Biome_" + eval(Biome_Text + "_Type")).length*Math.random());
        eval(Zone_Text + "_Item_1_Id = " + eval("List_Loot_Id_Biome_" + eval(Biome_Text + "_Type"))[Zone_Loot_1]);
        if (Math.random()*100 < eval("List_Loot_Stat_Biome_" + eval(Biome_Text + "_Type"))[Zone_Loot_1])
        {
            eval(Zone_Text + "_Item_1_Quan = " + 1);
        }
    }

    if (eval(Zone_Text + "_Monster") == 0)
    {
        Zone_Monster_1 = Math.floor(eval("List_Monster_Id_Biome_" + eval(Biome_Text + "_Type")).length*Math.random());
        eval(Zone_Text + "_Monster_1_Id = " + eval("List_Monster_Id_Biome_" + eval(Biome_Text + "_Type"))[Zone_Monster_1]);
        if (Math.random()*100 > eval("List_Monster_Stat_Biome_" + eval(Biome_Text + "_Type"))[Zone_Monster_1])
        {
            eval(Zone_Text + "_Monster_1_Id = " + 0);
        }
    }

    On_Battle = 0;

    Music.pause();
    Music = new Audio('Music/Adventure.mp3');
}

function new_zone (new_biome)
{
    eval(Zone_Text + "_PNJ = " + 0);
    eval(Zone_Text + "_Monster = " + 0);
    eval(Zone_Text + "_Item = " + 0);

    if (eval("typeof " + Biome_Text + "_Type") === 'undefined')
    {
        if (new_biome > 0)
        {
            eval(Biome_Text + "_Type = " + new_biome);
        }
        else
        {
            eval(Biome_Text + "_Type = " + parseInt(Math.random()*17 + 1));
        }
        eval(Biome_Text + "_Level =" + (parseInt(Math.sqrt(Math.pow(X,2) + Math.pow(Y,2))) + 1));
        Achiev_17++;
    }

    if (b == 0)
    {
        Building = Math.floor(eval("List_Building_Id_Biome_" + eval(Biome_Text + "_Type")).length*Math.random());
        Building_Id = eval("List_Building_Id_Biome_" + eval(Biome_Text + "_Type"))[Building];
        if (Math.random()*100 < eval("List_Building_Stat_Biome_" + eval(Biome_Text + "_Type"))[Building])
        {
            eval(Zone_Text + "_Building = " + Building_Id)
        }
        else
        {
            if (eval(Biome_Text + "_Type") == 12)
            {
                eval(Zone_Text + "_Building = " + 1);
            }
            else
            {
                eval(Zone_Text + "_Building = " + 0);
            }
        }
    }
    else
    {
        eval(Zone_Text + "_Building = " + 0);
    }

    switch (b)
    {
        case 1:
            switch (r)
            {
                case 1:
                    new_pnj(1);
                    break;
            }
            break;
        case 2:
            switch (r)
            {
                case 1:
                    new_pnj(2);
                    break;
            }
            break;
        case 3:
            switch (r)
            {
                case 1:
                    new_pnj(11);
                    break;
            }
            break;
        case 4:
            switch (r)
            {
                case 1:
                    new_pnj(12);
                    break;
            }
            break;
        case 5:
            switch (r)
            {
                case 1:
                    new_pnj(3);
                    break;
            }
            break;
        case 6:
            switch (r)
            {
                case 1:
                    new_pnj(4);
                    break;
            }
            break;
        case 8:
            switch (r)
            {
                case 1:
                    new_pnj(1);
                    break;
            }
            break;
        case 11:
            switch (r)
            {
                case 1:
                    new_pnj(5);
                    break;
            }
            break;
        case 12:
            switch (r)
            {
                case 1:
                    new_pnj(3);
                    break;
            }
            break;
        case 14:
            switch (r)
            {
                case 1:
                    new_pnj(7);
                    break;
            }
            break;
        case 15:
            switch (r)
            {
                case 1:
                    new_pnj(8);
                    break;
            }
            break;
        case 16:
            switch (r)
            {
                case 1:
                    new_pnj(9);
                    break;
            }
            break;
        case 18:
            switch (r)
            {
                case 1:
                    new_pnj(1);
                    break;
            }
            break;
        case 21:
            switch (r)
            {
                case 1:
                    new_pnj(1);
                    break;
            }
            break;
        case 26:
            switch (r)
            {
                case 1:
                    new_pnj(10);
                    break;
            }
            break;
        case 29:
            switch (r)
            {
                case 1:
                    new_pnj(14);
                    break;
            }
            break;
        case 30:
            switch (r)
            {
                case 1:
                    new_pnj(1);
                    break;
            }
            break;
        case 31:
            switch (r)
            {
                case 1:
                    new_pnj(13);
                    break;
            }
            break;
        case 32:
            switch (r)
            {
                case 1:
                    new_pnj(2);
                    break;
            }
            break;
        case 33:
            switch (r)
            {
                case 1:
                    new_pnj(13);
                    break;
            }
            break;
        case 35:
            switch (r)
            {
                case 1:
                    if (Math.random()*100 < 33 && eval(Biome_Text + "_Type") == 3)
                    {
                        eval(Zone_Text + "_Monster++");
                        eval(Zone_Text + "_Monster_1_Id = " + 10);
                    }
                    break;
            }
            break;
        case 40:
            switch (r)
            {
                case 1:
                    new_pnj(15);
                    break;
            }
            break;
        case 43:
            switch (r)
            {
                case 1:
                    new_pnj(16);
                    break;
            }
            break;
        case 46:
            switch (r)
            {
                case 1:
                    new_pnj(17);
                    break;
            }
            break;
        case 48:
            switch (r)
            {
                case 1:
                    new_pnj(18);
                    break;
            }
            break;
        case 49:
            switch (r)
            {
                case 1:
                    new_pnj(19);
                    break;
            }
            break;
        case 50:
            switch (r)
            {
                case 1:
                    new_pnj(21);
                    break;
            }
            break; 
    }
    Achiev_16++;
}

function option ()
{
    actualise();
    clavier_option = 1;

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    Text += "Raccourcis de Touches Affichés : ";
    if (Touch_Help == 1)
    {
        Text += "<a href='javascript:Touch_Help=0;option();'>Oui</a>";
    }
    else
    {
        Text += "<a href='javascript:Touch_Help=1;option();'>Non</a>";
    }
    Text += "<br/><br/>";
    Text += "<a href='javascript:quit()'>Retour à l'Ecran Titre</a>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function option_home ()
{
    clavier_option_home =1;

    Text = "";
    Text += "<a href='javascript:home();'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    Text += "Raccourcis de Touches Affichés : ";
    if (Touch_Help == 1)
    {
        Text += "<a href='javascript:Touch_Help=0;option_home();'>Oui</a>";
    }
    else
    {
        Text += "<a href='javascript:Touch_Help=1;option_home();'>Non</a>";
    }

    document.getElementById("interface").innerHTML = Text;
}

function pnj (slot,dialog)
{
    PNJ_Text = "";
    PNJ_Speak = "";

    switch (eval(Zone_Text + "_PNJ_" + slot + "_Work"))
    {
        case 1:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour.";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game();'>Au revoir</a>";
                    break;
            }
            break;
        case 2:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Que voulez-vous m'acheter ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(80);
                    verify_buy(99);
                    verify_buy(105);
                    verify_buy(126);
                    verify_buy(127);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    for (let id = 1; id <= Item; id++)
                    {
                        verify_sell(id,parseInt(eval("Item_" + id + "_Info[0]")*0.5));
                    }
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 3:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Que puis-je pour vous ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais passer la nuit ici</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",4)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    price = (eval("Biome_" + text_X + "_" + text_Y + "_" + text_Z + "_Level") + 4)*3;
                    PNJ_Text += "Une nuit vous coûtera " + price + " Ecus. <br/><br/>";
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:sleep(" + price + ")'>D'accord</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>Non merci</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(97);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 4:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(93,parseInt(Item_93_Info[0]*0.75));
                    verify_sell(96,parseInt(Item_96_Info[0]*0.75));
                    verify_sell(97,parseInt(Item_97_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 4:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Qu'est-ce que je vous sert ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(95);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(93,parseInt(Item_93_Info[0]*0.75));
                    verify_sell(94,parseInt(Item_94_Info[0]*0.75));
                    verify_sell(95,parseInt(Item_95_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 5:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Que désirez-vous ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais accéder à mon coffre</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/>";
                    PNJ_Text += Player_Money_1_Bank + " Ecus dans le coffre <br/><br/>";
                    PNJ_Text += "<input type='text' id='saisie_money'/> <br/><br/>";
                    PNJ_Text += "<a href='javascript:bank_give()'>Déposer</a> <br/>";
                    PNJ_Text += "<a href='javascript:bank_take()'>Retirer</a>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 6:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Salut. Qu'est-ce que tu veux ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(84);
                    verify_buy(86);
                    verify_buy(341);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(84,parseInt(Item_84_Info[0]*0.75));
                    verify_sell(86,parseInt(Item_86_Info[0]*0.75));
                    verify_sell(156,parseInt(Item_156_Info[0]*0.75));
                    verify_sell(341,parseInt(Item_341_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 7:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Salut. Avez-vous besoin d'aide ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(348);
                    verify_buy(349);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(348,parseInt(Item_348_Info[0]*0.75));
                    verify_sell(349,parseInt(Item_349_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 8:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Que voulez-vous m'acheter ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(210);
                    verify_buy(219);
                    verify_buy(225);
                    verify_buy(234);
                    verify_buy(240);
                    verify_buy(249);
                    verify_buy(255);
                    verify_buy(264);
                    verify_buy(271);
                    verify_buy(272);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    for (let n=1;n<=Item;n++)
                    {
                        if (eval("Item_" + n + "_Info[4]") == 1)
                        {
                            verify_sell(n,parseInt(eval("Item_" + n + "_Info[0]")*0.75));
                        }
                    }
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 9:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Que voulez-vous m'acheter ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(274);
                    verify_buy(276);
                    verify_buy(278);
                    verify_buy(280);
                    verify_buy(284);
                    verify_buy(291);
                    verify_buy(295);
                    verify_buy(302);
                    verify_buy(306);
                    verify_buy(313);
                    verify_buy(317);
                    verify_buy(326);
                    verify_buy(330);
                    verify_buy(337);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    for (let n=1;n<=Item;n++)
                    {
                        if (eval("Item_" + n + "_Info[4]") == 3 || eval("Item_" + n + "_Info[4]") == 4 || eval("Item_" + n + "_Info[4]") == 5 || eval("Item_" + n + "_Info[4]") == 6 || eval("Item_" + n + "_Info[4]") == 8 || eval("Item_" + n + "_Info[4]") == 10 || eval("Item_" + n + "_Info[4]") == 11)
                        {
                            verify_sell(n,parseInt(eval("Item_" + n + "_Info[0]")*0.75));
                        }
                    }
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 10:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour mon enfant. En quoi puis-je vous aider ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
            }
            break;
        case 11:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Je peux aider ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(65);
                    verify_buy(67);
                    verify_buy(69);
                    verify_buy(71);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(64,parseInt(Item_64_Info[0]*0.75));
                    verify_sell(65,parseInt(Item_65_Info[0]*0.75));
                    verify_sell(66,parseInt(Item_66_Info[0]*0.75));
                    verify_sell(67,parseInt(Item_67_Info[0]*0.75));
                    verify_sell(68,parseInt(Item_68_Info[0]*0.75));
                    verify_sell(69,parseInt(Item_69_Info[0]*0.75));
                    verify_sell(70,parseInt(Item_70_Info[0]*0.75));
                    verify_sell(71,parseInt(Item_71_Info[0]*0.75));
                    verify_sell(72,parseInt(Item_72_Info[0]*0.75));
                    verify_sell(73,parseInt(Item_73_Info[0]*0.75));
                    verify_sell(74,parseInt(Item_74_Info[0]*0.75));
                    verify_sell(75,parseInt(Item_75_Info[0]*0.75));
                    verify_sell(76,parseInt(Item_76_Info[0]*0.75));
                    verify_sell(77,parseInt(Item_77_Info[0]*0.75));
                    verify_sell(78,parseInt(Item_78_Info[0]*0.75));
                    verify_sell(79,parseInt(Item_79_Info[0]*0.75));
                    verify_sell(121,parseInt(Item_121_Info[0]*0.75));
                    verify_sell(122,parseInt(Item_122_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 12:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour mon gars. J'peux t'aider ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(109);
                    verify_buy(110);
                    verify_buy(111);
                    verify_buy(112);
                    verify_buy(113);
                    verify_buy(114);
                    verify_buy(116);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(4,parseInt(Item_4_Info[0]*0.75));
                    verify_sell(6,parseInt(Item_6_Info[0]*0.75));
                    verify_sell(15,parseInt(Item_15_Info[0]*0.75));
                    verify_sell(31,parseInt(Item_31_Info[0]*0.75));
                    verify_sell(35,parseInt(Item_35_Info[0]*0.75));
                    verify_sell(36,parseInt(Item_36_Info[0]*0.75));
                    verify_sell(37,parseInt(Item_37_Info[0]*0.75));
                    verify_sell(38,parseInt(Item_38_Info[0]*0.75));
                    verify_sell(109,parseInt(Item_109_Info[0]*0.75));
                    verify_sell(110,parseInt(Item_110_Info[0]*0.75));
                    verify_sell(111,parseInt(Item_111_Info[0]*0.75));
                    verify_sell(112,parseInt(Item_112_Info[0]*0.75));
                    verify_sell(113,parseInt(Item_113_Info[0]*0.75));
                    verify_sell(114,parseInt(Item_114_Info[0]*0.75));
                    verify_sell(115,parseInt(Item_115_Info[0]*0.75));
                    verify_sell(116,parseInt(Item_116_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 13:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Vous voudriez bien m'achetez quelque chose ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(101);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(101,parseInt(Item_101_Info[0]*0.75));
                    verify_sell(175,parseInt(Item_175_Info[0]*0.75));
                    verify_sell(176,parseInt(Item_176_Info[0]*0.75));
                    verify_sell(177,parseInt(Item_177_Info[0]*0.75));
                    verify_sell(178,parseInt(Item_178_Info[0]*0.75));
                    verify_sell(193,parseInt(Item_193_Info[0]*0.75));
                    verify_sell(194,parseInt(Item_194_Info[0]*0.75));
                    verify_sell(209,parseInt(Item_209_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 14:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Etes-vous en quête d'une information précise ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(48);
                    verify_buy(100);
                    verify_buy(102);
                    verify_buy(108);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(48,parseInt(Item_48_Info[0]*0.75));
                    verify_sell(100,parseInt(Item_100_Info[0]*0.75));
                    verify_sell(102,parseInt(Item_102_Info[0]*0.75));
                    verify_sell(108,parseInt(Item_108_Info[0]*0.75));
                    verify_sell(119,parseInt(Item_108_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 15:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Vous voulez goûtez un de mes légumes ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(83);
                    verify_buy(87);
                    verify_buy(103);
                    verify_buy(125);
                    verify_buy(128);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(83,parseInt(Item_83_Info[0]*0.75));
                    verify_sell(87,parseInt(Item_87_Info[0]*0.75));
                    verify_sell(103,parseInt(Item_103_Info[0]*0.75));
                    verify_sell(125,parseInt(Item_125_Info[0]*0.75));
                    verify_sell(128,parseInt(Item_128_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 16:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Salut mon gars. Tu voudrais pas quelque chose par hasard ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(64);
                    verify_buy(66);
                    verify_buy(68);
                    verify_buy(70);
                    verify_buy(121);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(64,parseInt(Item_64_Info[0]*0.75));
                    verify_sell(66,parseInt(Item_66_Info[0]*0.75));
                    verify_sell(68,parseInt(Item_68_Info[0]*0.75));
                    verify_sell(70,parseInt(Item_70_Info[0]*0.75));
                    verify_sell(72,parseInt(Item_72_Info[0]*0.75));
                    verify_sell(74,parseInt(Item_74_Info[0]*0.75));
                    verify_sell(76,parseInt(Item_76_Info[0]*0.75));
                    verify_sell(78,parseInt(Item_78_Info[0]*0.75));
                    verify_sell(121,parseInt(Item_121_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 17:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. C'est pour quoi ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(161);
                    verify_buy(163);
                    verify_buy(164);
                    verify_buy(167);
                    verify_buy(170);
                    verify_buy(351);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(157,parseInt(Item_157_Info[0]*0.75));
                    verify_sell(158,parseInt(Item_158_Info[0]*0.75));
                    verify_sell(161,parseInt(Item_161_Info[0]*0.75));
                    verify_sell(163,parseInt(Item_163_Info[0]*0.75));
                    verify_sell(167,parseInt(Item_167_Info[0]*0.75));
                    verify_sell(169,parseInt(Item_169_Info[0]*0.75));
                    verify_sell(170,parseInt(Item_170_Info[0]*0.75));
                    verify_sell(173,parseInt(Item_173_Info[0]*0.75));
                    verify_sell(174,parseInt(Item_174_Info[0]*0.75));
                    verify_sell(177,parseInt(Item_177_Info[0]*0.75));
                    verify_sell(179,parseInt(Item_179_Info[0]*0.75));
                    verify_sell(181,parseInt(Item_181_Info[0]*0.75));
                    verify_sell(183,parseInt(Item_183_Info[0]*0.75));
                    verify_sell(185,parseInt(Item_185_Info[0]*0.75));
                    verify_sell(187,parseInt(Item_187_Info[0]*0.75));
                    verify_sell(189,parseInt(Item_189_Info[0]*0.75));
                    verify_sell(197,parseInt(Item_197_Info[0]*0.75));
                    verify_sell(255,parseInt(Item_225_Info[0]*0.75));
                    verify_sell(256,parseInt(Item_256_Info[0]*0.75));
                    verify_sell(257,parseInt(Item_257_Info[0]*0.75));
                    verify_sell(258,parseInt(Item_258_Info[0]*0.75));
                    verify_sell(259,parseInt(Item_259_Info[0]*0.75));
                    verify_sell(260,parseInt(Item_260_Info[0]*0.75));
                    verify_sell(261,parseInt(Item_261_Info[0]*0.75));
                    verify_sell(262,parseInt(Item_262_Info[0]*0.75));
                    verify_sell(263,parseInt(Item_263_Info[0]*0.75));
                    verify_sell(264,parseInt(Item_264_Info[0]*0.75));
                    verify_sell(265,parseInt(Item_265_Info[0]*0.75));
                    verify_sell(266,parseInt(Item_266_Info[0]*0.75));
                    verify_sell(267,parseInt(Item_267_Info[0]*0.75));
                    verify_sell(268,parseInt(Item_268_Info[0]*0.75));
                    verify_sell(269,parseInt(Item_269_Info[0]*0.75));
                    verify_sell(271,parseInt(Item_271_Info[0]*0.75));
                    verify_sell(272,parseInt(Item_272_Info[0]*0.75));
                    verify_sell(351,parseInt(Item_351_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 18:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Salutation. Voudriez-vous profitez de mes services ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(119);
                    verify_buy(273);
                    verify_buy(350);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(119,parseInt(Item_119_Info[0]*0.75));
                    verify_sell(124,parseInt(Item_124_Info[0]*0.75));
                    verify_sell(240,parseInt(Item_240_Info[0]*0.75));
                    verify_sell(241,parseInt(Item_241_Info[0]*0.75));
                    verify_sell(242,parseInt(Item_242_Info[0]*0.75));
                    verify_sell(243,parseInt(Item_243_Info[0]*0.75));
                    verify_sell(244,parseInt(Item_244_Info[0]*0.75));
                    verify_sell(245,parseInt(Item_245_Info[0]*0.75));
                    verify_sell(246,parseInt(Item_246_Info[0]*0.75));
                    verify_sell(247,parseInt(Item_247_Info[0]*0.75));
                    verify_sell(248,parseInt(Item_248_Info[0]*0.75));
                    verify_sell(249,parseInt(Item_249_Info[0]*0.75));
                    verify_sell(250,parseInt(Item_250_Info[0]*0.75));
                    verify_sell(251,parseInt(Item_251_Info[0]*0.75));
                    verify_sell(252,parseInt(Item_252_Info[0]*0.75));
                    verify_sell(253,parseInt(Item_253_Info[0]*0.75));
                    verify_sell(254,parseInt(Item_254_Info[0]*0.75));
                    verify_sell(273,parseInt(Item_273_Info[0]*0.75));
                    verify_sell(350,parseInt(Item_350_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 19:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Puis-je aider en quoi que ce soit ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",2)'>J'aimerais acheter quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",3)'>J'aimerais vendre quelque chose</a> <br/>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(105);
                    verify_buy(106);
                    verify_buy(107);
                    verify_buy(137);
                    verify_buy(140);
                    verify_buy(143);
                    verify_buy(146);
                    verify_buy(149);
                    verify_buy(150);
                    verify_buy(153);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(105,parseInt(Item_105_Info[0]*0.75));
                    verify_sell(106,parseInt(Item_106_Info[0]*0.75));
                    verify_sell(107,parseInt(Item_107_Info[0]*0.75));
                    verify_sell(137,parseInt(Item_137_Info[0]*0.75));
                    verify_sell(138,parseInt(Item_138_Info[0]*0.75));
                    verify_sell(139,parseInt(Item_139_Info[0]*0.75));
                    verify_sell(140,parseInt(Item_140_Info[0]*0.75));
                    verify_sell(141,parseInt(Item_141_Info[0]*0.75));
                    verify_sell(142,parseInt(Item_142_Info[0]*0.75));
                    verify_sell(143,parseInt(Item_143_Info[0]*0.75));
                    verify_sell(144,parseInt(Item_144_Info[0]*0.75));
                    verify_sell(145,parseInt(Item_145_Info[0]*0.75));
                    verify_sell(146,parseInt(Item_146_Info[0]*0.75));
                    verify_sell(147,parseInt(Item_147_Info[0]*0.75));
                    verify_sell(148,parseInt(Item_148_Info[0]*0.75));
                    verify_sell(149,parseInt(Item_149_Info[0]*0.75));
                    verify_sell(150,parseInt(Item_150_Info[0]*0.75));
                    verify_sell(151,parseInt(Item_151_Info[0]*0.75));
                    verify_sell(152,parseInt(Item_152_Info[0]*0.75));
                    verify_sell(153,parseInt(Item_153_Info[0]*0.75));
                    verify_sell(154,parseInt(Item_154_Info[0]*0.75));
                    verify_sell(155,parseInt(Item_155_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
        case 20:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Vous avez besoin d'aide ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
            }
            break;
        case 21:
            switch (dialog)
            {
                case 1:
                    PNJ_Text += "Bonjour. Puis-je vous renseigner ?";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:game()'>Au revoir</a>";
                    break;
                case 2:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Prix</th> <th></th> </tr>";
                    verify_buy(341);
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
                case 3:
                    PNJ_Text += "</i>" + Player_Money_1 + " Ecus <br/><br/>";
                    PNJ_Text += "<table cellspacing='0' style='width:98%;'> <tr> <th>Obtenu</th> <th>Nom</th> <th>Niveau</th> <th>Valeur</th> <th></th> </tr>";
                    verify_sell(341,parseInt(Item_341_Info[0]*0.75));
                    PNJ_Text += "</table>";
                    PNJ_Speak += "<img src='Picture/Icon_Speak.png' class='icon'> <a href='javascript:pnj(" + slot + ",1)'>J'ai fini</a>";
                    break;
            }
            break;
    }

    Text = "";
    Text += eval("PNJ_" + eval(Zone_Text + "_PNJ_" + slot + "_Work") + "_Work") + ", " + eval("Sexe_" + eval(Zone_Text + "_PNJ_" + slot + "_Sexe") + "_Name") + "<br/>";
    Text += "<i>" + PNJ_Text + "</i> <br/><br/>";
    Text += PNJ_Speak + "<br/>";
    Text += "<img src='Picture/Icon_See.png' class='icon'> <a href='javascript:see_pnj(" + slot + "," + dialog + ")'>Observer</a>";

    document.getElementById("interface").innerHTML = Text;
}

function progress (name,css,value_1,value_2)
{
    Text += "<div class='flex'>";
    Text += "<div class='progress'>";
    Text += "<div class='" + css + "' style='width:" + (value_1/value_2)*100 + "%;'> </div>";
    Text += "</div> " + name + " : " + value_1 + " / " + value_2 + "</div>";
}

function quit ()
{
    Music.pause();

    home();
}

function refresh ()
{
    addEvent(window, "keydown", clavier)
    addEvent(window, "keyup", clavier)

    if (Player_Life <= 0)
    {
        game_over();
    }

    if (On_Battle == 1 && Monster_Life <= 0)
    {
        On_Battle = 0;
        if (Player_Level <= Monster_Level)
        {
            Player_Xp += eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Xp + "]")*(Monster_Level + 4);
        }
        Player_Money_1 += eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Money + "]")*(Monster_Level + 4);
        Achiev_4 += eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Money + "]")*(Monster_Level + 4);
        Achiev_6 += eval("Monster_" + Monster_Id + "_Stat[" + Monster_Stat_Money + "]")*(Monster_Level + 4);
        Achiev_15++;
        eval("Monster_"  + Monster_Id + "_Kill++");
        eval(Zone_Text + "_Monster--");
        eval(Zone_Text + "_Monster_" + Monster_Slot + "_Id = " + 0);

        battle_win();
    }
}

function remove (id)
{   
    get_item(eval("Player_Equip_" + id + "_Id"),eval("Player_Equip_" + id + "_Level"),1);
    eval("Player_Equip_" + id + "_Id = " + 0);
    eval("Player_Equip_" + id + "_Level = " + 0);

    equipment();
}

function save ()
{
    actualise();
    clavier_save = 1;

    Text = "";
    Text += "<a href='javascript:game();'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    Text += "Code de Sauvegarde : <br/><br/> <div style='word-wrap: break-word;'>";
    Text += Debug + "_" + Player_Name + "_" + Player_Race + "_" + Player_Sexe + "_" + Player_Level + "_" + Player_Xp + "_" + Player_Life + "_" + Player_Stamina + "_" + Player_Mana + "_" + Player_Concentration + "_";
    for (let n=1;n<=Statut;n++)
    {
        Text += eval("Player_Statut_" + n) + "_";
    }
    for (let n=1;n<=Money;n++)
    {
        Text += eval("Player_Money_" + n) + "_" + eval("Player_Money_" + n + "_Bank") + "_";
    }
    Text += Player_Skill + "_" + Player_Skill_Max + "_";
    for (let n=0;n<=Player_Stat;n++)
    {
        Text += eval("Player_Skill_" + n) + "_";
    }
    for (let n=1;n<=Achiev;n++)
    {
        Text += eval("Achiev_" + n) + "_";
    }
    for (let n=1;n<=Monster;n++)
    {
        Text += eval("Monster_" + n + "_Kill") + "_";
    }
    for (let n=1;n<=11;n++)
    {
        Text += eval("Player_Equip_" + n + "_Id") + "_" + eval("Player_Equip_" + n + "_Level") + "_";
    }
    Text += Bag + "_";
    for (let n=1;n<=Bag;n++)
    {
        Text += eval("Bag_" + n) + "_" + eval("Bag_" + n + "_Id") + "_" + eval("Bag_" + n + "_Level") + "_";
    }
    Text += year + "_" + month + "_" + day + "_" + hour + "_" + minute + "_";
    Text += "</div>";

    document.getElementById("interface").innerHTML = Text;
}

function see_race (id)
{
    Text = "";
    Text += "<center>";
    Text += "<a href='javascript:select_race(" + Debug + ");'>Retour</a> <br/><br/>";

    switch (id)
    {
        case 1:
            Text += "L'espèce humaine est la plus répandue dans le monde, assurant donc une diplomatie avec à peu près toute les autres races. <br/>";
            Text += "Attention tout de même car certaines refusent encore la domination toujours plus grande des humains.";
            Text += "<br/><br/>";
            Text += "<font color='red'>Aucun Bonus</font>";
            break;
        case 2:
            Text += "Les nains sont sûrement les représentants des montagnes les plus nombreux y compris devant les humains tant leur affinité avec cet environnement est grande. <br/>"
            Text += "Si les idées reçues en font des sauvages obsédés par les caillous, les nains savent manier la magie et tirent leur pouvoir de leur artisanat reconnu dans le monde entier.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 5 Défense Physique (par Niveau)</font>";
            break;
        case 3:
            Text += "Depuis la nuit des temps, les elfes ont dominés les régions forestières grâce à leur magie et leur savoir ancestral. <br/>";
            Text += "Aujourd'hui contestés par les humains, leurs homologues elfes noire et les féliens, les elfes comptent bien défendre leurs droits et leurs terres.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 10 Attaque à Distance (par Niveau)</font>";
            break;
        case 4:
            Text += "Si les elfes ne quittent rarement les forêts, c'est pour éviter des menaces exterieures qu'ils ne pourraient contrôler en dehors de leur habitat de prédilection. <br/>";
            Text += "Mais les elfes noirs ont eux osés pour pouvoir mieux se demarquer des elfes et gagner leur indépendance territoriale. <br/>";
            Text += "C'est pourquoi on les trouvent le plus souvent dans des marais, plus propices à la fabrication d'onguents et de potions dont ce peuple est spécialiste.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 10 Attaque Magique (par Niveau)</font>";
            break;
        case 5:
            Text += "Les gnomes peuplent les collines pour le calme qui y rêgne d'oû leur réputation d'êtres calmes. <br/>";
            Text += "Mais ces petits êtres savent utiliser leurs facultés pour se battre et n'hésitent pas à le faire.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 10 Stockage (par Niveau)</font>";
            break;
        case 6:
            Text += "Les déserts sont parmis les environnements les plus hostiles à l'occupation d'une espèce tant les conditions de vie sont difficiles. <br/>";
            Text += "Mais les écailles des reptiliens les protègent de la chaleur ambiante et de la corrosion du sable. <br/>";
            Text += "Considérés comme des pariats par certains peuples, ils n'en restent pas moins de redoutables combattants au corps à corps.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 10 Vitesse (par Niveau)</font>";
            break;
        case 7:
            Text += "Si les océans sont inacessibles à de nombreuses races, ce n'est pas le cas des siréniens. La maîtrise de l'élément aquatique à permis aux siréniens de se mouvoir comme bon leur semblait dans la mer. <br/>";
            Text += "L'évolution à fait que leur corps s'est habitué et leur morphologie est désormais adaptée à leur nouvel habitat.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 5 Défense Magique (par Niveau)</font>";
            break;
        case 8:
            Text += "Les cieux appartienent aux harpiens, une espèce dotée d'une paire d'ailes. Leur capacité à voler et leur magie aérienne en font les maîtres incontestés du ciel. <br/>";
            Text += "Mais une fois sur terre, les harpiens entrent en concurrence avec d'autres races dont ils se sont éloignés depuis longtemps...";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 5 Défense à Distance (par Niveau)</font>";
            break;
        case 9:
            Text += "Les zones volcaniques sont le domaine des créatures les plus dangereuses du monde parmis lesquelles les dragons, les golem et les laviens. Ces derniers sont des êtres nés de la terre en fusion et se nourissant de minerais. <br/>";
            Text += "Pourtant les laviens sont les seuls êtres capables de communiquer avec d'autres races dans leur habitat ce qui leur confère un avantage certain : qui oserait s'aventurer dans un volcan sans leur accord ?";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 10 Attaque Physique (par Niveau)</font>";
            break;
        case 10:
            Text += "La savane est une région très riche et pourtant toujours aussi sauvage et ce grâce à leurs gardiens : les féliens. <br/>";
            Text += "Ces êtres proches des elfes et des humains ont pourtant une parenté avec les félins présents dans les savanes depuis toujours. <br/>";
            Text += "Agiles, forts et rusés, les féliens sont des combattants redoutables mais qui s'esquivent à l'art de la magie de part des traditions plus guerrières.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 1 Action</font>";
            break;
        case 11:
            Text += "Souvent comparé avec les reptiliens, les draconiens n'ont pourtant aucun lien de parenté connu avec ces derniers. <br/>";
            Text += "Surnommés les fils des dragons, les draconiens sont capables de s'habituer à n'importe quel climat et à n'importe quelle coutume mais sont rejetés la plupart du temps à cause de leur physique monstrueux.";
            Text += "<br/><br/>";
            Text += "<font color='green'>+ 100 Vitalité (par Niveau)</font>";
            break;
    }

    Text += "<br/><br/>";
    Text += "<a href='javascript:new_race(" + id + ")'>Choisir</a>";
    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function see_pnj (slot,dialog)
{
    Text = "";
    Text += "<a href='javascript:pnj(" + slot + "," + dialog + ")'>Retour</a> <br/><br/>";

    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:25%'>Partie</th> <th style='width:25%'>Nom</th> <th style='width:25%'>Niveau</th> <th style='width:25%'></th> </tr>";

    verify_equipment(Zone_Text + "_PNJ_1",1,"Arme Droite","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",2,"Arme Gauche","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",3,"Couvre-Tête","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",11,"Dos","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",4,"Buste","Torse Nu");
    verify_equipment(Zone_Text + "_PNJ_1",8,"Main Droite","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",9,"Main Gauche","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",10,"Taille","Rien");
    verify_equipment(Zone_Text + "_PNJ_1",5,"Jambes","Nues");
    verify_equipment(Zone_Text + "_PNJ_1",6,"Pied Droit","Pied Nu");
    verify_equipment(Zone_Text + "_PNJ_1",7,"Pied Gauche","Pied Nu");

    Text += "</table>";

    document.getElementById("interface").innerHTML = Text;
}

function select_equip (id)
{
    Text = "";
    Text += "<a href='javascript:inventory(" + File + "," + File2 + "," + File3 + ")'>Retour</a> <br/><br/>";
    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:25%;'>Partie</th> <th style='width:25%;'>Nom</th> <th style='width:25%;'>Niveau</th> <th style='width:25%;'></th> </tr>"

    switch (eval("Item_" + eval("Bag_" + id + "_Id") + "_Info[4]"))
    {
        case 1:
            if (Player_Equip_1_Id > 0)
            {
                Text += "<tr> <td>Arme Droite</td> <td>" + eval("Item_" + Player_Equip_1_Id + "_Name") + "</td> <td>" + Player_Equip_1_Level + "</td> <td><a href='javascript:equip(" + id + ",1)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Arme Droite</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",1)'>Equiper</a></td> </tr>";
            }
            if (Player_Equip_2_Id > 0)
            {
                Text += "<tr> <td>Arme Gauche</td> <td>" + eval("Item_" + Player_Equip_2_Id + "_Name") + "</td> <td>" + Player_Equip_2_Level + "</td> <td><a href='javascript:equip(" + id + ",2)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Arme Gauche</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",2)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 3:
            if (Player_Equip_3_Id > 0)
            {
                Text += "<tr> <td>Couvre-Tête</td> <td>" + eval("Item_" + Player_Equip_3_Id + "_Name") + "</td> <td>" + Player_Equip_3_Level + "</td> <td><a href='javascript:equip(" + id + ",3)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Couvre-Tête</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",3)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 4:
            if (Player_Equip_4_Id > 0)
            {
                Text += "<tr> <td>Buste</td> <td>" + eval("Item_" + Player_Equip_4_Id + "_Name") + "</td> <td>" + Player_Equip_4_Level + "</td> <td><a href='javascript:equip(" + id + ",4)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Buste</td> <td colspan='2' style='text-align:center;'><i>Torse Nu</i></td> <td><a href='javascript:equip(" + id + ",4)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 5:
            if (Player_Equip_5_Id > 0)
            {
                Text += "<tr> <td>Jambes</td> <td>" + eval("Item_" + Player_Equip_5_Id + "_Name") + "</td> <td>" + Player_Equip_5_Level + "</td> <td><a href='javascript:equip(" + id + ",5)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Jambes</td> <td colspan='2' style='text-align:center;'><i>Nues</i></td> <td><a href='javascript:equip(" + id + ",5)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 6:
            if (Player_Equip_6_Id > 0)
            {
                Text += "<tr> <td>Pied Droit</td> <td>" + eval("Item_" + Player_Equip_6_Id + "_Name") + "</td> <td>" + Player_Equip_6_Level + "</td> <td><a href='javascript:equip(" + id + ",6)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Pied Droit</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",6)'>Equiper</a></td> </tr>";
            }
            if (Player_Equip_7_Id > 0)
            {
                Text += "<tr> <td>Pied Gauche</td> <td>" + eval("Item_" + Player_Equip_7_Id + "_Name") + "</td> <td>" + Player_Equip_7_Level + "</td> <td><a href='javascript:equip(" + id + ",7)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Pied Gauche</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",7)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 8:
            if (Player_Equip_8_Id > 0)
            {
                Text += "<tr> <td>Main Droit</td> <td>" + eval("Item_" + Player_Equip_8_Id + "_Name") + "</td> <td>" + Player_Equip_8_Level + "</td> <td><a href='javascript:equip(" + id + ",8)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Main Droit</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",8)'>Equiper</a></td> </tr>";
            }
            if (Player_Equip_9_Id > 0)
            {
                Text += "<tr> <td>Main Gauche</td> <td>" + eval("Item_" + Player_Equip_9_Id + "_Name") + "</td> <td>" + Player_Equip_9_Level + "</td> <td><a href='javascript:equip(" + id + ",9)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Main Gauche</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",9)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 10:
            if (Player_Equip_10_Id > 0)
            {
                Text += "<tr> <td>Taille</td> <td>" + eval("Item_" + Player_Equip_10_Id + "_Name") + "</td> <td>" + Player_Equip_10_Level + "</td> <td><a href='javascript:equip(" + id + ",10)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Taille</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",10)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
        case 11:
            if (Player_Equip_11_Id > 0)
            {
                Text += "<tr> <td>Dos</td> <td>" + eval("Item_" + Player_Equip_11_Id + "_Name") + "</td> <td>" + Player_Equip_11_Level + "</td> <td><a href='javascript:equip(" + id + ",11)'>Remplacer</a></td> </tr>";
            }
            else
            {
                Text += "<tr> <td>Dos</td> <td colspan='2' style='text-align:center;'><i>Rien</i></td> <td><a href='javascript:equip(" + id + ",11)'>Equiper</a></td> </tr>";
            }
            Text += "<tr> <td>Nouveau</td> <td>" + eval("Item_" + eval("Bag_" + id + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + id + "_Level") + "</td> </tr>";
            break;
    }
    Text += "</table>";

    document.getElementById("interface").innerHTML = Text;
}

function select_name ()
{
    Text = "";
    Text += "<center>";
    Text += "<a href='javascript:select_sexe();'>Retour</a> <br/><br/>";
    Text += "Choississez votre nom : <br/><br/>";
    Text += "<input id='new_name' value='Paul'></input> <br/><br/>";
    Text += "<a href='javascript:new_name();'>Choisir</a>";
    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function select_player ()
{
    Text = "";
    Text += "<center>";
    Text += "Vous avez choisi d'incarner un " + eval("Race_" + Player_Race + "_Name") + " " + eval("Sexe_" + Player_Sexe + "_Name") + " nommé " + Player_Name + " ? <br/><br/>"
    Text += "<a href='javascript:new_game();'>Oui</a> <br/><br/>";
    Text += "<a href='javascript:select_name();'>Changer votre Nom</a> <br/>";
    Text += "<a href='javascript:select_sexe();'>Changer votre Sexe</a> <br/>";
    Text += "<a href='javascript:see_race(" + Player_Race + ");'>Changer votre Race</a>";
    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function select_race (dev)
{
    Debug = dev;

    Text = "";
    Text += "<center>";
    Text += "<a href='javascript:home();'>Retour</a> <br/><br/>";
    Text += "Sélectionnez votre race : <br/><br/>";

    for (let id = 1; id <= Race; id++)
    {
        Text += "<a href='javascript:see_race(" + id + ");'>" + eval("Race_" + id + "_Name") + "</a> <br/>";
    }

    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function select_sexe ()
{
    Text = "";
    Text += "<center>";
    Text += "<a href='javascript:see_race(" + Player_Race + ")'>Retour</a> <br/><br/>";
    Text += "Sélectionnez votre sexe : <br/><br/>";
    Text += "<a href='javascript:new_sexe(1)'>Homme</a> <br/>";
    Text += "ou <br/>";
    Text += "<a href='javascript:new_sexe(2)'>Femme</a>";
    Text += "</center>";

    document.getElementById("interface").innerHTML = Text;
}

function sell (id,value)
{
    Player_Money_1 += value;
    Achiev_13++;
    Achiev_4 += value;
    Achiev_5 += value;
    get_item(eval("Bag_" + id + "_Id"),eval("Bag_" + id + "_Level"),-1);
}

function skill ()
{
    actualise();
    clavier_character = 1;

    Text = "";
    Text += "<a href='javascript:character()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    Text += "Points de Caractéristiques Total : " + Player_Skill_Max + "<br/>";
    Text += "Points de Caractéristiques Restants : " + Player_Skill + "<br/><br/>";
    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:20%;'>Statistique</th> <th style='width:20%;'>Points Utilisés</th> <th style='width:20%;'>Bonus Unitaire</th> <th style='width:20%;'>Bonus Total</th> <th style='width:20%;'></th> </tr>";

    Text += "<tr> <td>Vitalité</td> <td>" + eval("Player_Skill_" + Player_Stat_Life_Max) + "</td> <td>10 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Life_Max)*10 + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Life_Max + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Energie</td> <td>" + eval("Player_Skill_" + Player_Stat_Stamina_Max) + "</td> <td>1 pour 2 Points</td> <td>" + parseInt(eval("Player_Skill_" + Player_Stat_Stamina_Max)*0.5) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Stamina_Max + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Mana</td> <td>" + eval("Player_Skill_" + Player_Stat_Mana_Max) + "</td> <td>1 pour 2 Points</td> <td>" + parseInt(eval("Player_Skill_" + Player_Stat_Mana_Max)*0.5) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Mana_Max + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Concentration</td> <td>" + eval("Player_Skill_" + Player_Stat_Concentration_Max) + "</td> <td>1 pour 2 Points</td> <td>" + parseInt(eval("Player_Skill_" + Player_Stat_Concentration_Max)*0.5) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Concentration_Max + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Attaque Physique</td> <td>" + eval("Player_Skill_" + Player_Stat_Physical_Attack) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Physical_Attack) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Physical_Attack + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Défense Physique</td> <td>" + eval("Player_Skill_" + Player_Stat_Physical_Defense) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Physical_Defense) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Physical_Defense + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Attaque Magique</td> <td>" + eval("Player_Skill_" + Player_Stat_Magical_Attack) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Magical_Attack) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Magical_Attack + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Défense Magique</td> <td>" + eval("Player_Skill_" + Player_Stat_Magical_Defense) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Magical_Defense) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Magical_Defense + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Attaque à Distance</td> <td>" + eval("Player_Skill_" + Player_Stat_Distance_Attack) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Distance_Attack) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Distance_Attack + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Défense à Distance</td> <td>" + eval("Player_Skill_" + Player_Stat_Distance_Defense) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Distance_Defense) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Distance_Defense + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Actions</td> <td>" + eval("Player_Skill_" + Player_Stat_Action_Max) + "</td> <td>1 pour 100 Points</td> <td>" + parseInt(eval("Player_Skill_" + Player_Stat_Action_Max)*0.1) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Action_Max + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Vitesse</td> <td>" + eval("Player_Skill_" + Player_Stat_Speed) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Speed) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Speed + ")'>Améliorer</a></td> </tr>";
    Text += "<tr> <td>Stockage</td> <td>" + eval("Player_Skill_" + Player_Stat_Stockage_Max) + "</td> <td>1 pour 1 Point</td> <td>" + eval("Player_Skill_" + Player_Stat_Stockage_Max) + "</td> <td><a href='javascript:skill_up(" + Player_Stat_Stockage_Max + ")'>Améliorer</a></td> </tr>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function skill_up (id)
{
    if (Player_Skill > 0)
    {
        Player_Skill--;
        eval("Player_Skill_" + id + "++");

        skill();
    }
}

function sleep (price)
{
    if (Player_Money_1 >= price)
    {
        Player_Money_1 -= price;
        Player_Life = Player_Life_Max;
        Player_Stamina = Player_Stamina_Max;
        Player_Mana = Player_Mana_Max;
        Player_Concentration = Player_Concentration_Max;
        Achiev_2++;

        game();
    }
}

function spell ()
{
    actualise();
    clavier_skill = 1;

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/><br/>";
    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th style='width:20%;'>Nom</th> <th style='width:20%;'>Niveau</th> <th style='width:60%;'>Description</th> </tr>";

    for (let id = 1; id <= Spell; id++)
    {
        if (eval("Spell_" + id + "_Level") > 0)
        {
            Text += "<tr> <td>" + eval("Spell_" + id + "_Name") + "</td> <td>" + eval("Spell_" + id + "_Level") + "</td> <td>";
            spell_description(id);
            Text += "</td> </tr>";
        }
    }

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function spell_description (id)
{
    switch (id)
    {
        case 1:
            Text += "Inflige des dégats physiques d'environ 100% de votre attaque physique. Coûte 2 actions et 1 d'énergie.";
            break;
        case 2:
            Text += "Inflige des dégats magiques d'environ 100% de votre attaque magique. Coûte 2 actions et 1 de mana.";
            break;
        case 3:
            Text += "Inflige des dégats à distance d'environ 100% de votre attaque à distance. Coûte 2 actions et 1 de concentration.";
            break;
        case 4:
            Text += "Soigne votre personnage de 250 vitalité. Coûte 3 actions et 5 de mana.";
            break;
        case 5:
            
            break;
        case 6:
            
            break;
        case 7:
            
            break;
        case 8:
            
            break;
        case 9:
            
            break;
        case 10:
            Text += "Soigne votre personnage d'environ 20% de votre vitalité maximale. Coûte 3 actions et 5 de mana.";
            break;
        case 11:
            Text += "Inflige des dégats physiques d'environ 150% de votre attaque physique. Coûte 3 actions et 5 d'énergie.";
            break;
        case 12:
            Text += "Inflige des dégats magiques d'environ 150% de votre attaque magique. Coûte 3 actions et 5 de mana.";
            break;
        case 13:
            Text += "Inflige des dégats à distance d'environ 150% de votre attaque à distance. Coûte 3 actions et 5 de concentration.";
            break;
        case 14:
            Text += "Inflige des dégats physiques d'environ 1000% d'un nombre compris entre 10 et 30. Vous fais perdre autant d'écus. Coûte 3 actions et 5 de mana.";
            break;
        case 15:
            Text += "Inflige des dégats à distance d'environ 1000% d'un nombre compris entre 10 et 30. Vous fais perdre autant d'écus. Coûte 3 actions et 5 de concentration.";
            break;
        case 16:

            break;
        case 17:
            
            break;
        case 18:
            
            break;
        case 19:
            
            break;
        case 20:
            
            break;
        case 21:
            
            break;
        case 22:
            
            break;
        case 23:
            
            break;
        case 24:
            Text += "Inflige des dégats physiques d'environ 100% de votre attaque physique. A 33% de chance d'empoisonner' l'adversaire pour 4 tours. Coûte 3 actions et 5 d'énergie.";
            break;
        case 25:
            Text += "Inflige des dégats à distance d'environ 100% de votre attaque à distance. A 33% de chance d'empoisonner l'adversaire pour 4 tours. Coûte 3 actions et 5 de concentration.";
            break;
        case 26:
            Text += "Inflige des dégats magiques d'environ 100% de votre attaque magique. A 33% de chance de brûler l'adversaire pour 4 tours. Coûte 3 actions et 5 de mana.";
            break;
        case 27:
            
            break;
        case 28:
            
            break;
        case 29:
            
            break;
        case 30:
            
            break;
        case 31:
            
            break;
        case 32:
            
            break;
        case 33:
            
            break;
    }
}

function station_craft ()
{
    actualise();

    Text = "";
    Text += "<a href='javascript:game()'>Quitter</a> <br/><br/>";
    Text += "Niveau " + Craft_Level + " <input type='text' id='saisie_craft'/> <a href='javascript:Craft_Level=document.getElementById(" + '"saisie_craft"' + ").value;station_craft();'>Changer le Niveau des Objets</a> <br/><br/>";
    Text += "<table cellspacing='0' style='width:98%;'> <tr> <th colspan='3' style='width:20%;'>Résultat 1</th> <th colspan='3' style='width:20%;'>Résultat 2</th> <th colspan='2' style='width:20%;'>Ingrédient 1</th> <th colspan='2' style='width:20%;'>Ingrédient 2</th> <th colspan='2' style='width:20%;'>Ingrédient 3</th> </tr>";
    Text += "<tr> <td style='width:10%;'>Nom</td> <td style='width:5%'>Fabriqué</td> <td style='width:5%'>Obtenu</td> <td style='width:10%'>Nom</td> <td style='width:5%'>Fabriqué</td> <td style='width:5%'>Obtenu</td> <td style='width:10%'>Nom</td> <td style='width:10%'>Demandé</td> <td style='width:10%'>Nom</td> <td style='width:10%'>Demandé</td> <td style='width:10%'>Nom</td> <td style='width:10%'>Demandé</td> </tr>";

    switch (Craft)
    {
        case 1:
            verify_craft(1,1,30,1,0,0,46,10);
            verify_craft(1,1,48,1,0,0,47,2);
            verify_craft(1,1,80,1,0,0,167,3);
            verify_craft(1,1,80,1,0,0,173,3);
            verify_craft(1,1,80,1,0,0,185,3);
            verify_craft(1,1,80,1,0,0,189,3);
            verify_craft(1,1,80,1,0,0,197,3);
            verify_craft(1,1,81,1,0,0,157,3);
            verify_craft(1,1,81,1,0,0,158,3);
            verify_craft(1,1,81,1,0,0,164,3);
            verify_craft(1,1,81,1,0,0,169,3);
            verify_craft(1,1,81,1,0,0,170,3);
            verify_craft(1,1,81,1,0,0,177,3);
            verify_craft(1,1,81,1,0,0,179,3);
            verify_craft(1,1,81,1,0,0,183,3);
            verify_craft(1,1,82,1,0,0,163,3);
            verify_craft(1,1,82,1,0,0,174,3);
            verify_craft(1,1,82,1,0,0,181,3);
            verify_craft(1,1,82,1,0,0,187,3);
            verify_craft(1,1,92,2,0,0,41,1);
            verify_craft(1,1,94,1,0,0,30,2);
            verify_craft(1,1,96,1,0,0,30,3);
            verify_craft(1,2,100,1,0,0,81,2,48,10);
            verify_craft(1,2,102,1,0,0,108,1,101,5);
            verify_craft(1,2,104,1,0,0,108,1,103,5);
            verify_craft(1,1,105,1,0,0,30,1);
            verify_craft(1,1,106,1,0,0,30,2);
            verify_craft(1,1,107,1,0,0,30,4);
            verify_craft(1,1,156,1,0,0,13,5);
            verify_craft(1,1,156,1,0,0,14,3);
            verify_craft(1,1,279,1,0,0,81,5);
            verify_craft(1,1,280,1,0,0,82,5);
            verify_craft(1,1,281,1,0,0,83,5);
            verify_craft(1,1,290,1,0,0,81,5);
            verify_craft(1,1,291,1,0,0,82,5);
            verify_craft(1,1,292,1,0,0,83,5);
            verify_craft(1,1,301,1,0,0,81,5);
            verify_craft(1,1,302,1,0,0,82,5);
            verify_craft(1,1,303,1,0,0,83,5);
            verify_craft(1,1,312,1,0,0,81,5);
            verify_craft(1,1,313,1,0,0,82,5);
            verify_craft(1,1,314,1,0,0,83,5);
            verify_craft(1,1,325,1,0,0,81,5);
            verify_craft(1,1,326,1,0,0,82,5);
            verify_craft(1,1,327,1,0,0,83,5);
            verify_craft(1,1,342,1,0,0,341,5);
            verify_craft(1,1,343,1,0,0,81,5);
            verify_craft(1,1,344,1,0,0,82,5);
            verify_craft(1,1,345,1,0,0,83,5);
            break;
        case 2:
            verify_craft(1,2,89,1,0,0,88,1,12,3);
            verify_craft(1,2,89,1,0,0,88,1,34,1);
            verify_craft(1,2,98,1,0,0,83,1,4,1);
            break;
        case 3:
            verify_craft(1,1,30,1,0,0,9,8);
            verify_craft(1,1,30,1,0,0,10,12);
            verify_craft(1,1,30,1,0,0,11,4);
            verify_craft(1,1,65,1,0,0,64,3);
            verify_craft(1,1,67,1,0,0,66,3);
            verify_craft(1,1,69,1,0,0,68,3);
            verify_craft(1,1,71,1,0,0,70,3);
            verify_craft(1,1,73,1,0,0,72,3);
            verify_craft(1,1,75,1,0,0,74,3);
            verify_craft(1,1,77,1,0,0,76,3);
            verify_craft(1,1,79,1,0,0,78,3);
            verify_craft(1,2,89,1,0,0,88,1,12,3);
            verify_craft(1,2,89,1,0,0,88,1,34,1);
            verify_craft(1,2,122,1,0,0,66,3,64,3);
            break;
        case 4:
            verify_craft(1,1,217,1,0,0,65,5);
            verify_craft(1,1,218,1,0,0,67,5);
            verify_craft(1,1,219,1,0,0,69,5);
            verify_craft(1,1,220,1,0,0,71,5);
            verify_craft(1,1,221,1,0,0,73,5);
            verify_craft(1,1,222,1,0,0,75,5);
            verify_craft(1,1,223,1,0,0,77,5);
            verify_craft(1,1,224,1,0,0,79,5);
            verify_craft(1,1,232,1,0,0,65,5);
            verify_craft(1,1,233,1,0,0,67,5);
            verify_craft(1,1,234,1,0,0,69,5);
            verify_craft(1,1,235,1,0,0,71,5);
            verify_craft(1,1,236,1,0,0,73,5);
            verify_craft(1,1,237,1,0,0,75,5);
            verify_craft(1,1,238,1,0,0,77,5);
            verify_craft(1,1,239,1,0,0,79,5);
            verify_craft(1,2,247,1,0,0,65,4,173,1);
            verify_craft(1,2,248,1,0,0,67,4,173,1);
            verify_craft(1,2,249,1,0,0,69,4,173,1);
            verify_craft(1,2,250,1,0,0,71,4,173,1);
            verify_craft(1,2,251,1,0,0,73,4,173,1);
            verify_craft(1,2,252,1,0,0,75,4,173,1);
            verify_craft(1,2,253,1,0,0,77,4,173,1);
            verify_craft(1,2,254,1,0,0,79,4,173,1);
            verify_craft(1,2,262,1,0,0,65,4,172,1);
            verify_craft(1,2,263,1,0,0,67,4,172,1);
            verify_craft(1,2,264,1,0,0,69,4,172,1);
            verify_craft(1,2,265,1,0,0,71,4,172,1);
            verify_craft(1,2,266,1,0,0,73,4,172,1);
            verify_craft(1,2,267,1,0,0,75,4,172,1);
            verify_craft(1,2,268,1,0,0,77,4,172,1);
            verify_craft(1,2,269,1,0,0,79,4,172,1);
            verify_craft(1,1,282,1,0,0,65,5);
            verify_craft(1,1,283,1,0,0,67,5);
            verify_craft(1,1,284,1,0,0,69,5);
            verify_craft(1,1,285,1,0,0,71,5);
            verify_craft(1,1,286,1,0,0,73,5);
            verify_craft(1,1,287,1,0,0,75,5);
            verify_craft(1,1,288,1,0,0,77,5);
            verify_craft(1,1,289,1,0,0,79,5);
            verify_craft(1,1,293,1,0,0,65,5);
            verify_craft(1,1,294,1,0,0,67,5);
            verify_craft(1,1,295,1,0,0,69,5);
            verify_craft(1,1,296,1,0,0,71,5);
            verify_craft(1,1,297,1,0,0,73,5);
            verify_craft(1,1,298,1,0,0,75,5);
            verify_craft(1,1,299,1,0,0,77,5);
            verify_craft(1,1,300,1,0,0,79,5);
            verify_craft(1,1,304,1,0,0,65,5);
            verify_craft(1,1,305,1,0,0,67,5);
            verify_craft(1,1,306,1,0,0,69,5);
            verify_craft(1,1,307,1,0,0,71,5);
            verify_craft(1,1,308,1,0,0,73,5);
            verify_craft(1,1,309,1,0,0,75,5);
            verify_craft(1,1,310,1,0,0,77,5);
            verify_craft(1,1,311,1,0,0,79,5);
            verify_craft(1,1,315,1,0,0,65,5);
            verify_craft(1,1,316,1,0,0,67,5);
            verify_craft(1,1,317,1,0,0,69,5);
            verify_craft(1,1,318,1,0,0,71,5);
            verify_craft(1,1,319,1,0,0,73,5);
            verify_craft(1,1,320,1,0,0,75,5);
            verify_craft(1,1,321,1,0,0,77,5);
            verify_craft(1,1,322,1,0,0,79,5);
            verify_craft(1,1,328,1,0,0,65,5);
            verify_craft(1,1,329,1,0,0,67,5);
            verify_craft(1,1,330,1,0,0,69,5);
            verify_craft(1,1,331,1,0,0,71,5);
            verify_craft(1,1,332,1,0,0,73,5);
            verify_craft(1,1,333,1,0,0,75,5);
            verify_craft(1,1,334,1,0,0,77,5);
            verify_craft(1,1,335,1,0,0,79,5);
            break;
        case 5:
            verify_craft(1,1,85,1,0,0,84,1);
            break;
        case 6:
            verify_craft(1,1,109,1,0,0,6,2);
            verify_craft(1,1,110,1,0,0,15,2);
            verify_craft(1,1,111,1,0,0,35,2);
            verify_craft(1,1,112,1,0,0,36,2);
            verify_craft(1,1,113,1,0,0,37,2);
            verify_craft(1,1,114,1,0,0,38,2);
            verify_craft(1,1,116,1,0,0,115,2);
            verify_craft(1,1,210,1,0,0,109,3);
            verify_craft(1,1,211,1,0,0,110,3);
            verify_craft(1,1,212,1,0,0,111,3);
            verify_craft(1,1,213,1,0,0,112,3);
            verify_craft(1,1,214,1,0,0,113,3);
            verify_craft(1,1,215,1,0,0,114,3);
            verify_craft(1,1,216,1,0,0,116,3);
            verify_craft(1,1,225,1,0,0,109,3);
            verify_craft(1,1,226,1,0,0,110,3);
            verify_craft(1,1,227,1,0,0,111,3);
            verify_craft(1,1,228,1,0,0,112,3);
            verify_craft(1,1,229,1,0,0,113,3);
            verify_craft(1,1,230,1,0,0,114,3);
            verify_craft(1,1,231,1,0,0,116,3);
            verify_craft(1,2,240,1,0,0,109,2,124,1);
            verify_craft(1,2,241,1,0,0,110,2,124,1);
            verify_craft(1,2,242,1,0,0,111,2,124,1);
            verify_craft(1,2,243,1,0,0,112,2,124,1);
            verify_craft(1,2,244,1,0,0,113,2,124,1);
            verify_craft(1,2,245,1,0,0,114,2,124,1);
            verify_craft(1,2,246,1,0,0,116,2,124,1);
            verify_craft(1,2,255,1,0,0,109,2,271,1);
            verify_craft(1,2,256,1,0,0,110,2,271,1);
            verify_craft(1,2,257,1,0,0,111,2,271,1);
            verify_craft(1,2,258,1,0,0,112,2,271,1);
            verify_craft(1,2,259,1,0,0,113,2,271,1);
            verify_craft(1,2,260,1,0,0,114,2,271,1);
            verify_craft(1,2,261,1,0,0,116,2,271,1);
            break;
        case 7:
            verify_craft(1,2,89,1,0,0,88,1,12,3);
            verify_craft(1,2,89,1,0,0,88,1,34,1);
            break;
        case 8:
            verify_craft(1,2,95,1,0,0,94,1,86,3);
            verify_craft(1,2,97,1,0,0,96,1,87,5);
            break;
        case 9:
            verify_craft(1,1,274,1,0,0,126,5);
            verify_craft(1,1,275,1,0,0,127,5);
            verify_craft(1,1,276,1,0,0,126,5);
            verify_craft(1,1,277,1,0,0,127,5);
            verify_craft(1,1,323,1,0,0,126,5);
            verify_craft(1,1,324,1,0,0,127,5);
            verify_craft(1,1,336,1,0,0,126,5);
            verify_craft(1,1,337,1,0,0,126,5);
            verify_craft(1,1,338,1,0,0,127,5);
            verify_craft(1,1,339,1,0,0,126,5);
            verify_craft(1,1,340,1,0,0,127,5);
            verify_craft(1,1,346,1,0,0,126,5);
            verify_craft(1,1,347,1,0,0,127,5);
            break;
        case 11:
            verify_craft(1,3,137,1,0,0,105,1,1,3,2,1);
            verify_craft(1,3,138,1,0,0,106,1,1,5,270,1);
            verify_craft(1,3,139,1,0,0,107,1,1,8,149,1);
            verify_craft(1,3,140,1,0,0,105,1,58,3,2,1);
            verify_craft(1,3,141,1,0,0,106,1,58,5,270,1);
            verify_craft(1,3,142,1,0,0,107,1,58,8,149,1);
            verify_craft(1,3,143,1,0,0,105,1,59,3,2,1);
            verify_craft(1,3,144,1,0,0,106,1,59,5,270,1);
            verify_craft(1,3,145,1,0,0,107,1,59,8,149,1);
            verify_craft(1,3,146,1,0,0,105,1,60,3,2,1);
            verify_craft(1,3,147,1,0,0,106,1,60,5,270,1);
            verify_craft(1,3,148,1,0,0,107,1,60,8,149,1);
            verify_craft(1,3,150,1,0,0,105,1,3,3,2,1);
            verify_craft(1,3,151,1,0,0,106,1,3,5,270,1);
            verify_craft(1,3,152,1,0,0,107,1,3,8,149,1);
            verify_craft(1,3,153,1,0,0,105,1,136,3,2,1);
            verify_craft(1,3,154,1,0,0,106,1,136,5,270,1);
            verify_craft(1,3,155,1,0,0,107,1,136,8,149,1);
            break;
    }

    refresh();
    
    document.getElementById("interface").innerHTML = Text;
}

function statistique (name,title,leveling,skill_grade)
{
    eval(name + "_" + title + " = " + eval("Race_" + eval(name + "_Race") + "_Stat[" + eval("Player_Stat_" + title) + "]"));
    if (leveling == 1)
    {
        eval(name + "_" + title + " = " + eval(name + "_" + title)*(eval(name + "_Level") + 4));
    }
    eval(name + "_" + title + " = " + (eval(name + "_" + title) + parseInt(eval(name + "_Skill_" + eval("Player_Stat_" + title))*skill_grade)));
    for (let n=1;n<=11;n++)
    {
        if (eval(name + "_Equip_" + n + "_Id") > 0)
        {
            eval(name + "_" + title + " = " + (eval(name + "_" + title) + eval("Item_" + eval(name + "_Equip_" + n + "_Id") + "_Stat[" + eval("Player_Stat_" + title) + "]")*(eval(name + "_Equip_" + n + "_Level") + 4)));
        }
    }
}

function statistique_monster (name,title,leveling)
{
    eval(name + "_" + title + "=" + eval("Monster_" + Monster_Id + "_Stat[" + eval("Monster_Stat_" + title) + "]"));
    if (leveling == 1)
    {
        eval(name + "_" + title + "=" + eval(name + "_" + title)*(eval(name + "_Level") + 4));
    }
}

function time (temps)
{
    minute += temps;
    if (minute >= 60)
    {
        minute -= 60;
        hour ++;
        if (hour >= 24)
        {
            hour -= 24;
            day++;
            if (day > 30)
            {
                day -= 30;
                month++;
                if (month > 12)
                {
                    mounth -= 12;
                    year++;
                }
            }
        }
    }

    if (Player_Statut_1 > 0)
    {
        Player_Statut_1--;
        Player_Life -= parseInt(Player_Life_Max*0.05);
    }
    if (Player_Statut_2 > 0)
    {
        Player_Statut_2--;
        Player_Life -= parseInt(Player_Life_Max*0.05);
    }
    if (Player_Statut_3 > 0)
    {
        Player_Statut_3--;
        Player_Life -= parseInt(Player_Life_Max*0.05);
    }
    Player_Stamina++;
    Player_Mana++;
    Player_Concentration++;
}

function use_item (id)
{
    Drop_Use = 1;
    Bag_Level = eval("Bag_" + id + "_Level");

    switch (eval("Bag_" + id + "_Id"))
    {
        case 83:
            Player_Life += 25*(Bag_Level + 4);
            break;
        case 87:
            Player_Life += 25*(Bag_Level + 4);
            break;
        case 95:
            get_item(94,Bag_Level,1);
            break;
        case 97:
            get_item(96,Bag_Level,1);
            break;
        case 98:
            Player_Life += 50*(Bag_Level + 4);
            get_item(4,Bag_Level,1);
            break;
        case 99:
            Player_Life += 35*(Bag_Level + 4);
            break;
        case 103:
            Player_Life += 20*(Bag_Level + 4);
            break;
        case 125:
            Player_Life += 35*(Bag_Level + 4);
            break;
        case 128:
            Player_Life += 25*(Bag_Level + 4);
            get_item(129,Bag_Level,1);
            break;
        case 137:
            Player_Life += 75*(Bag_Level + 4);
            get_item(105,Bag_Level,1);
            break;
        case 138:
            Player_Life += 125*(Bag_Level + 4);
            get_item(106,Bag_Level,1);
            break;
        case 139:
            Player_Life += 250*(Bag_Level + 4);
            get_item(107,Bag_Level,1);
            break;
        case 140:
            Player_Stamina += Bag_Level + 4;
            get_item(105,Bag_Level,1);
            break;
        case 141:
            Player_Stamina += parseInt(1.5*(Bag_Level + 4));
            get_item(106,Bag_Level,1);
            break;
        case 142:
            Player_Stamina += parseInt(2.5*(Bag_Level + 4));
            get_item(107,Bag_Level,1);
            break;
        case 143:
            Player_Mana += Bag_Level + 4;
            get_item(105,Bag_Level,1);
            break;
        case 144:
            Player_Mana += parseInt(1.5*(Bag_Level + 4));
            get_item(106,Bag_Level,1);
            break;
        case 145:
            Player_Mana += parseInt(2.5*(Bag_Level + 4));
            get_item(107,Bag_Level,1);
            break;
        case 146:
            Player_Concentration += Bag_Level + 4;
            get_item(105,Bag_Level,1);
            break;
        case 147:
            Player_Concentration += parseInt(1.5*(Bag_Level + 4));
            get_item(106,Bag_Level,1);
            break;
        case 148:
            Player_Concentration += parseInt(2.5*(Bag_Level + 4));
            get_item(107,Bag_Level,1);
            break;
        case 150:
            if (Bag_Level >= Player_Level)
            {
                Player_Statut_1 -= 3;
            }
            else
            {
                Player_Statut_1--;
            }
            get_item(105,Bag_Level,1);
            break;
        case 151:
            if (Bag_Level >= Player_Level)
            {
                Player_Statut_1 -= 5;
            }
            else
            {
                Player_Statut_1--;
            }
            get_item(106,Bag_Level,1);
            break;
        case 152:
            if (Bag_Level >= Player_Level)
            {
                Player_Statut_1 -= 8;
            }
            else
            {
                Player_Statut_1--;
            }
            get_item(107,Bag_Level,1);
            break;
        case 153:
            if (Bag_Level >= Player_Level)
            {
                Player_Statut_2 -= 3;
            }
            else
            {
                Player_Statut_2--;
            }
            get_item(105,Bag_Level,1);
            break;
        case 154:
            if (Bag_Level >= Player_Level)
            {
                Player_Statut_2 -= 5;
            }
            else
            {
                Player_Statut_2--;
            }
            get_item(106,Bag_Level,1);
            break;
        case 155:
            if (Bag_Level >= Player_Level)
            {
                Player_Statut_2 -= 8;
            }
            else
            {
                Player_Statut_2--;
            }
            get_item(107,Bag_Level,1);
            break;
    }

    if (Drop_Use == 1)
    {
        get_item(eval("Bag_" + id + "_Id"),eval("Bag_" + id + "_Level"),-1);
    }

    inventory(File,File2,File3);
}

function use_spell (id)
{
    list_spell("Player","Monster",id);

    if (Player_Statut_4 > 0)
    {
        Player_Statut_4--;
        Player_Life -= parseInt(Player_Life_Max*0.1);
    }

    battle();
}

function verify_equipment (type,id,name,empty)
{
    Text += "<tr> <td>" + name + "</td>";
    if (eval(type + "_Equip_" + id + "_Id") > 0)
    {
        Text += "<td>" + eval("Item_" + eval(type + "_Equip_" + id + "_Id") + "_Name") + "</td> <td>" + eval(type + "_Equip_" + id + "_Level") + "</td>";
        if (type == "Player")
        {   
            Text += "<td><a href='javascript:remove(" + id + ")'>Enlever</a></td>";
        }
    }
    else
    {
        Text += "<td colspan='2' style='text-align:center;'><i>" + empty + "</i></td>";
    }
    Text += "</tr>";
}

function world_map ()
{
    actualise();
    clavier_map = 1;

    Text = "";
    Text += "<a href='javascript:game()'>Retour</a>";
    if (Touch_Help == 1)
    {
        Text += " (echap)";
    }
    Text += "<br/> <center>";
    Text += "<a href='javascript:map()'>Carte de la Région</a> <br/><br/>";
    Text += "<table cellspacing='0' class='Map'>";

    Text + "<tr>";
    Text += "<td class='border_map'></td>";
    for (let id_x = (X - 5); id_x <= (X + 5); id_x++)
    {
        Text += "<td class='border_map'>" + id_x + "</td>";
    }
    Text += "<td class='border_map'></td>";
    Text + "</tr>";
    
    for (let id_Y = (Y + 5); id_Y >= (Y - 5); id_Y--)
    {
        Text_Y = id_Y;
        if (id_Y < 0)
        {
            Text_Y = "n" + (-id_Y);
        }
        Text += "<tr>";
        Text += "<td class='border_map'>" + id_Y + "</td>";
        for (let id_X = (X - 5); id_X <= (X + 5); id_X++)
        {
            Text_X = id_X;
            if (id_X < 0)
            {
                Text_X = "n" + (-id_X);
            }

            Text += "<td ";
            if (id_X == X && id_Y == Y)
            {
                Text += "style='border:solid;border-color:red;' ";
            }
            if (eval("typeof Biome_" + Text_X + "_" + Text_Y + "_" + text_Z + "_Type") === 'undefined')
            {
                Text += "class='undefined_map'>?";
            }
            else
            {
                Text += "class='map'>" + eval("Biome_" + eval("Biome_" + Text_X + "_" + Text_Y + "_" + text_Z + "_Type") + "_Name");
            }
            Text += "</td>";
        }
        Text += "<td class='border_map'>" + id_Y + "</td>";
        Text += "</tr>";
    }

    Text + "<tr>";
    Text += "<td class='border_map'></td>";
    for (let id_x = (X - 5); id_x <= (X + 5); id_x++)
    {
        Text += "<td class='border_map'>" + id_x + "</td>";
    }
    Text += "<td class='border_map'></td>";
    Text + "</tr>";

    Text += "</tr> </table> </center>";

    refresh();

    document.getElementById("interface").innerHTML = Text;
}

function verify_buy (id)
{
    if (eval("typeof Item_" + id + "_Level_" + eval(Biome_Text + "_Level")) === 'undefined')
    {
        eval("Item_" + id + "_Level_" + eval(Biome_Text + "_Level") + "= 0")
    }
    PNJ_Text += "<tr> <td>" + eval("Item_" + id + "_Level_" + eval(Biome_Text + "_Level")) + "</td> <td>" + eval("Item_" + id + "_Name") + "</td> <td>" + eval(Biome_Text + "_Level") + "</td> <td>" + eval("Item_" + id + "_Info[0]")*(eval(Biome_Text + "_Level") + 4) + " Ecus</td> <td><a href='javascript:buy(" + id + ");'>Acheter</a></td> </tr>";
}

function verify_craft (resultat,ingredient,id_r1,quan_r1,id_r2,quan_r2,id_1,quan_1,id_2,quan_2,id_3,quan_3)
{
    if (eval("typeof Item_" + id_r1 + "_Level_" + Craft_Level) === 'undefined')
    {
        eval("Item_" + id_r1 + "_Level_" + Craft_Level + " = " + 0)
    }
    if (eval("typeof Item_" + id_r2 + "_Level_" + Craft_Level) === 'undefined')
    {
        eval("Item_" + id_r2 + "_Level_" + Craft_Level + " = " + 0)
    }
    if (eval("typeof Item_" + id_1 + "_Level_" + Craft_Level) === 'undefined')
    {
        eval("Item_" + id_1 + "_Level_" + Craft_Level + " = " + 0)
    }
    if (eval("typeof Item_" + id_2 + "_Level_" + Craft_Level) === 'undefined')
    {
        eval("Item_" + id_2 + "_Level_" + Craft_Level + " = " + 0)
    }
    if (eval("typeof Item_" + id_3 + "_Level_" + Craft_Level) === 'undefined')
    {
        eval("Item_" + id_3 + "_Level_" + Craft_Level + " = " + 0)
    }

    if (eval("Item_" + id_1 + "_Level_" + Craft_Level) >= quan_1  && (ingredient < 2 || eval("Item_" + id_2 + "_Level_" + Craft_Level) >= quan_2)  && (ingredient < 3 || eval("Item_" + id_3 + "_Level_" + Craft_Level) >= quan_3))
    {
        Text += "<tr> <td>" + eval("Item_" + id_r1 + "_Name") + "</td> <td>" + quan_r1 + "</td> <td>" + eval("Item_" + id_r1 + "_Level_" + Craft_Level) + "</td>";
        if (resultat > 1)
        {
            Text += "<td>" + eval("Item_" + id_r2 + "_Name") + "</td> <td>" + quan_r2 + "</td> <td>" + eval("Item_" + id_r2 + "_Level_" + Craft_Level) + "</td>";
        }
        else
        {
            Text += "<td colspan='3'></td>";
        }
        Text += "<td>" + eval("Item_" + id_1 + "_Name") + "</td> <td>" + eval("Item_" + id_1 + "_Level_" + Craft_Level) + " / " + quan_1 + "</td>";
        if (ingredient > 1)
        {
            Text += "<td>" + eval("Item_" + id_2 + "_Name") + "</td> <td>" + eval("Item_" + id_2 + "_Level_" + Craft_Level) + " / " + quan_2 + "</td>";
            if (ingredient > 2)
            {
                Text += "<td>" + eval("Item_" + id_3 + "_Name") + "</td> <td>" + eval("Item_" + id_3 + "_Level_" + Craft_Level) + " / " + quan_3 + "</td>";
            }
            else
            {
                Text += "<td colspan='2'></td>";
            }
        }
        else
        {
            Text += "<td colspan='4'></td>";
        }
        Text += "<td><a href='javascript:craft(" + resultat + ',' + ingredient + ',' + id_r1 + ',' + quan_r1 + ',' + id_r2 + ',' + quan_r2 + ',' + id_1 + ',' + quan_1;
        if (ingredient > 1)
        {
            Text += ',' + id_2 + ',' + quan_2;
        }
        Text += ")'>Fabriquer</a></td> <tr>";
    }
}

function verify_sell (id,value)
{
    for (let n=1;n<=Bag;n++)
    {
        if (eval("Bag_" + n + "_Id") == id)
        {
            PNJ_Text += "<tr> <td>" + eval("Bag_" + n) + "</td> <td>" + eval("Item_" + eval("Bag_" + n + "_Id") + "_Name") + "</td> <td>" + eval("Bag_" + n + "_Level") + "</td> <td>" + value*(eval("Bag_" + n + "_Level") + 4) + "</td> <td><a href='javascript:sell(" + n + "," + value*(eval("Bag_" + n + "_Level") + 4) + ")'>Vendre</a></td> </tr>";
        }
    }
}