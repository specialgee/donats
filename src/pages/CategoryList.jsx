import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import api from '../api';

class UpdateVideo extends Component {
    render() {
        return <Link className="updateLink" to={`/admin/categories/update/${this.props.id}`}>Update</Link>
    }
}

class DeleteVideo extends Component {
    deleteEntry = async () => {
        if (
            window.confirm(
                //`Voulez-vous supprimer ${this.props.id} définitivement ?`,
                "Voulez-vous supprimer cette catégorie définitivement ?",
            )
        ) {
            await new Promise(async (resolve, reject) => {
                await api.deleteCategoryById(this.props.id).then( () => {
                    resolve();
                });    
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                window.location.reload(true);
            });
        }        
    }


    render() {
        return <Link className="deleteLink" to={`/admin/categories/list`} onClick={this.deleteEntry}>Delete</Link>
    }
}

class CategoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            swiper: null,
            categories: [],
            covers: [],
            coversGroups: [],
            isLoading: true,
        }
                      
        this.params = {
            slidesPerView: 3,
            spaceBetween: 40,
            speed: 300,
            initialSlide: 1,
            centeredSlides: true,
            prevenClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: true,
            loop: false,
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
            },
            // pagination: {
            //   el: '.swiper-pagination',
            //   clickable: true,
            //   type: 'bullets',
            //   dynamicBullets: true
            // },
            // breakpoints: {
            //     1024: {
            //         slidesPerView: 3,
            //         spaceBetween: 40
            //     },
            //     768: {
            //         slidesPerView: 3,
            //         spaceBetween: 30
            //     },
            //     640: {
            //         slidesPerView: 2,
            //         spaceBetween: 20
            //     },
            //     320: {
            //         slidesPerView: 2,
            //         spaceBetween: 10
            //     }
            // },
            // on: {
            //     init: () => {
            //         console.log("INIT SWIPER");
            //     },
            //     click: (event) => {
                
            //     }
            // }      
        }

        this.updateSwiper = this.updateSwiper.bind(this);
        this.splitCovers = this.splitCovers.bind(this);
    }

    componentDidMount = async () => {
        // /!\ PASS CATEGORIES AS PROPS
        await api.getAllCategories()
        .then(async (categories) => {
    
            await this.setState({
                categories: categories.data.data,
            });

            console.log("CATEGORIES LOADED: ", this.state.categories);
    
            return this.state.categories;
        }).then(async (categories) => {
            const categoriesCovers = categories.map((category) =>
                <div key={category.name.toString()}>
                    <img className="swiper-slide-image" data-category={category.name} src={category.cover} alt="category cover" />
                </div>
            );

            // temporarily hide not visible categories
            categories.forEach(category => {
                if (!category.isVisible) {
                    for (let i = 0; i < categoriesCovers.length; i++) {
                        if (categoriesCovers[i].key === category.name) {
                            categoriesCovers.splice(i, 1);
                        }
                    }
                }
            });
    
            await this.setState({ 
                covers: categoriesCovers
            });

            console.log("COVERS LOADED: ", this.state.covers);

            return this.state.covers;
        }).then(async (covers) => {
            let coversGroups = this.splitCovers(covers);

            await this.setState({
                coversGroups: coversGroups
            })

            console.log("COVERS SPLITTED: ", this.state.coversGroups);

            return this.state;
        }).then(async (state) => {
            await this.setState({
                isLoading: false
            })

            console.log("STATE READY: ", this.state);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            
        });
    }

    componentWillUnmount() {

    }

    updateSwiper(swiper) {
        this.setState({ swiper });
    }

    splitCovers(coversArray) {
        let coversLength = coversArray.length;
        
        let coversMedian;
        // even or odd median
        coversLength % 2 === 0 ? coversMedian = coversLength/2 : coversMedian = Math.floor(coversLength/2);

        let coversElements = {
            firstGroup: [],
            secondGroup: []
        }

        for (let i = 0; i < coversLength; i++) {
            if (i >= coversMedian) {
                coversElements.secondGroup.push(coversArray[i]);
            } else {
                coversElements.firstGroup.push(coversArray[i]);
            }
        } 

        return coversElements;
    }

    render() {
        const {coversGroups, isLoading} = this.state;

        return (                        
            <div id="category-list-wrapper">
                {!isLoading && (
                    <div id="category-list-container">
                        <div className="row">
                            <div className="col-lg">
                                <div className="align-items-center justify-content-center">                                    
                                    <h1 id="category-list-title">CATÉGORIES</h1>

                                    <div id="category-slider-container">
                                        <section className="category-list-section">
                                            <Swiper getSwiper={this.updateSwiper} {...this.params}>
                                                {coversGroups.firstGroup}
                                            </Swiper>
                                        </section>

                                        <section className="category-list-section">
                                            <Swiper getSwiper={this.updateSwiper} {...this.params}>
                                                {coversGroups.secondGroup}
                                            </Swiper>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default CategoryList;
