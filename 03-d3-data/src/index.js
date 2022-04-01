import * as d3 from 'd3';
import { json } from 'd3-fetch'


//Si un seul dataset
// d3.json('url/ou/chemin/du/fichier.json')
//     .then(function (data) {
//         // Dessiner ici!
//     })
//     .catch(function (error) {
//         // Gérer l'erreur ici!
//     })



Promise.all([ //Pour importer plusieurs datasets
    json('https://jsonplaceholder.typicode.com/posts'),
    json('https://jsonplaceholder.typicode.com/users')
])
    .then(([posts, users]) => {

        // * A partir des données **users** et **posts**, créez un tableau d'objets qui a la structure suivante
        // [
        //     {
        //       nom_utilisateur: 'Machin',
        //       ville: 'Truc',
        //       nom_companie: 'Bidule',
        //       titres_posts: [
        //         'Titre 1',
        //         'Titre 2',
        //       ]
        //     },
        //   ]

        // on met dans un tableau tous les users (un par case) et le template est comme celui ci-dessus
        const tableau = users.map((d, i) => { //accumulateur, currentvalue. Chaque case du tableau correspondant à une personne,

            //on met dans un tableau tous les posts filtrés de sorte à ce que le userId du post soit le même du id du user
            //les posts sont ainsi filtrés par users
            const post_Filtered = posts.filter(p => p.userId == d.id)//...  contiennent les valeurs filtrées des posts : Forcément 10 car 10 users, les posts triés par users

            //ça injecte les valeurs des éléments id, nom, ville, compagnie (etc) dans le tableau en lien avec les variables json
            return { ["id"]: [d.id], ["Nom d'utilisateur"]: [d.username], ["Ville"]: [d.address.city], ["Nom compagnie"]: [d.company.name], ["Titres posts"]: [...post_Filtered] }
        });

        // Affiche le tableau selon le template demandé
        console.log(tableau);


        //Variable pour le nombre de post par users
        const nbusers = d3.count(users) //cela compte le nombre d'item/éléments, ici c'est les users
        const nbposts = d3.count(posts) //pareil mais pour le nombre de posts

        //Voir le tableau des users avec les élémets JSON injectés
        console.log(users)
        console.log(posts)

        //Voir le nb de users et de posts
        console.log(nbusers) //0
        console.log(nbposts) //0


        //On cherche mnt à compter tous le nb de posts par users et les afficher
        // 1 —— On commence déjà à compter le nb de post par user
        users.forEach(user => {
            let compteurParUser = 0;

            //pour chaque user, on itère tous les posts et on regarder lesquels appartiennet à chaque user dans la boucle
            posts.forEach(post => {
                // console.log(post.userId);
                if (post.userId == user.id) {
                    compteurParUser++;
                }
            })
            //le compteurParUser il représente en fait le nb de post compté par user.


            // 2 — Ensuite on veut afficher une phrase qui dit le nb d'articles par user.
            const svg = d3.select("body")
                .append("svg")
                .attr("width", 600)
                .attr("height", 60)
                .append("text")
                .attr("x", "50")
                .attr("y", "50")
                .text(`${user.name} a écrit ${compteurParUser} articles`)
        })


        // 3 — on cherche mnt quel est le post le plus long et par qui ça a été écrit_

        //On crée une variable avec une longueur adéquate pour l'utiliser dans la boucle et une variable qui va prendre l'id du user en question
        let longestPost = 'hello';
        let longestPostUser;

        posts.forEach(post => {
            if (longestPost.length < post.body.length) {
                longestPost = post.body;
                longestPostUser = post.userId;

            }

        })

        console.log(longestPost)
        console.log(longestPostUser);

        //on affiche une phrase qui dit quel est le user qui a écrit le plus long post et on l'affiche
        d3.select("body")
            .append("div")
            .attr('id', 'longestPost')
        d3.select('#longestPost')
            .append('p')
            .text(`Le user avec l'id n°${longestPostUser} a écrit le plus long post. Ce dernier disait "${longestPost}".`)

        console.log(tableau);



        // 4 — on veut dessiner un graphique en barre avec l'axe x les users et l'axe y le nb de post

        //Dessiner graphique en baton
        d3.select('body').append('h2')
        //set les marges pour le svg du graph
        let margin = { top: 30, right: 30, bottom: 80, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        let svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        let userName = []
        users.forEach(user => {
            userName.push(user.name)
        })
        //axe des x
        let x = d3.scaleBand()
            .range([0, width])
            .domain(userName)
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        //axe des y
        let y = d3.scaleLinear()
            .domain([0, 15])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        // Bars
        let randomColor = Math.floor(Math.random() * 16777215).toString(16)
        users.forEach(user => {
            let nbpost = 0
            posts.forEach(post => {
                if (post.userId == user.id) {
                    nbpost++
                }
            })
            svg.append("rect")
                .attr("x", x(user.name))
                .attr("y", y(nbpost))
                .attr("width", x.bandwidth())
                .attr("height", height - y(nbpost))
                .attr("fill", `#${randomColor}`)
        })

    }).catch((error) => {
        console.log(error)
    })

