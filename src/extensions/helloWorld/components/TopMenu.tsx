import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import PropTypes from 'prop-types';
import { sp } from "@pnp/sp";
import { taxonomy, ITermData, ITerm, ITermSetData} from "@pnp/sp-taxonomy";

import { CommandBar, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';

import * as SPTermStore from'./../services/SPTermStoreService';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

import { IConfiguration,IStructure,IChildren } from '../../../models';
import { ConfigService } from '../../../services';
import { GetStructure } from '../../../common';


import $ from 'jquery'

import './Header.css';
import styles from './HeaderStyle.module.scss';

export interface ITopMenuProps
{
    terSetId:string;
    depSetId:string;

}

export interface ITopMenuState
{
    terms : (ITermData & ITerm)[],
    changeHeightClass : boolean,
    hover : boolean,
    addClass:boolean,
    addMobileMenuClass:boolean,
    addMobileHeader:string,
    clientHeight:number,
    DepartmentChildren:Array<string>,
    test:(IConfiguration)[],
    AllchildrenItems:(IChildren)[],    
    DepartmentchildrenItems:(IChildren)[],
    MyTeamSitechildrenItems:(IChildren)[],
}


export default class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

    public constructor(props){
        super();
        this.state = {
            terms:[],
            changeHeightClass : true,
            hover:false,
            addClass:false,
            addMobileMenuClass:false,
            addMobileHeader:"",
            clientHeight:0,
            DepartmentChildren:[],
            test:[],
            AllchildrenItems:[{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""}],
            DepartmentchildrenItems:[{name:"",path:""},{name:"",path:""}],
            MyTeamSitechildrenItems:[{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""},{name:"",path:""}],
        };
    }

    changeHeightClass(){
        this.setState({changeHeightClass:!this.state.changeHeightClass})
    }

    hoverOn(value){
        var test = value.currentTarget.id;
        // this.setState({ hover: true });
        switch(test){
            case "home":
                this.setState({ clientHeight:0 })
            break;

            case "department":
                this.setState({ clientHeight:80 })
            break;

            case "myteamsite":
                this.setState({ clientHeight:200 })
            break;
        }
      }
    hoverOff(){ 
        // this.setState({ hover: false });
        this.setState({clientHeight:0})
    }

    public passItems(Obj){
        var headers=ConfigService.getItems();

        var Home=GetStructure.getStructure(headers[0].name,Obj);
        var FundInformation = GetStructure.getStructure(headers[1].name,Obj);
        var Department=GetStructure.getStructure(headers[2].name,Obj);
        var MyTeamSite= GetStructure.getStructure(headers[3].name,Obj);
        var SelfService = GetStructure.getStructure(headers[4].name,Obj);
        var Community = GetStructure.getStructure(headers[5].name,Obj);

        if(Home.length>1){
            Home.splice(0, 1);
            var HomeChildren=this.splitTermChild(Home,"Home");
            
        }
        if(FundInformation.length>1){
            FundInformation.splice(0, 1);
            var FundInformationChildren = this.splitTermChild(FundInformation,"FundInformation");
        }
        if(Department.length>1){
            Department.splice(0, 1);
            this.splitTermChild(Department,"Department");
            // this.setState({DepartmentchildrenItems:this.state.AllchildrenItems});
        }
        if(MyTeamSite.length>1){
            MyTeamSite.splice(0, 1);
            this.splitTermChild(MyTeamSite,"MyTeamSite");
            // this.setState({MyTeamSitechildrenItems:MyTeamSiteChildren});
        }

        if(SelfService.length>1){
            SelfService.splice(0, 1);
            var SelfServiceChildren = this.splitTermChild(SelfService,"SlefService");
        }
        if(Community.length>1){
            Community.splice(0, 1);
            var CommunityChildren = this.splitTermChild(Community,"Community");
        }
    }
    public openMobileNav(){
        this.setState({addClass:!this.state.addClass});
    }

    public openMobileMenu(value){
        this.setState({addMobileHeader: value.currentTarget.id});
        this.setState({addMobileMenuClass:!this.state.addMobileMenuClass});
    }


    public splitTermChild(obj,headerName){
        if(headerName=="Department"){
            obj.forEach((element,index) => {
                // string.split(";")[1]
                this.state.DepartmentchildrenItems[index].name=element.PathOfTerm.split(";")[1];
                // this.state.DepartmentchildrenItems[index].name=element.PathOfTerm.substring(element.PathOfTerm.indexOf(";")+1);
                this.state.DepartmentchildrenItems[index].path=element.LocalCustomProperties._Sys_Nav_SimpleLinkUrl;
            });
            //this.setState({DepartmentchildrenItems:this.state.AllchildrenItems})
        }
        if(headerName=="MyTeamSite"){
            obj.forEach((element,index) => {
                this.state.MyTeamSitechildrenItems[index].name=element.PathOfTerm.substring(element.PathOfTerm.indexOf(";")+1);
                this.state.MyTeamSitechildrenItems[index].path=element.LocalCustomProperties._Sys_Nav_SimpleLinkUrl;
            });
            //this.setState({MyTeamSitechildrenItems:this.state.AllchildrenItems})
        }

       
    }


    public render(): React.ReactElement<ITopMenuProps> {
        // let header__curtain = this.state.changeHeightClass?"header__curtain":"header__curtainWithHeight";
        // let header__underLine = this.state.showUnderLine?styles.underlineShow:styles.underlineShow;
        const headerItems = ConfigService.getItems;
        const currentHeight= this.state.hover?0:50;
        const newHeight = this.state.clientHeight;
        
        let btnBurgerStyle =["btn-burger"];
        let headerStyle = ["header header--primary"];
        // breadcrumbs 
        let breadCrumbsStyle= [" breadcrumbs-mobile primary-nav paddingLeft0"];

        let mobileDepartmentMenu=[""]
        let mobileMyTeamSiteMenu=[""]
        if(this.state.addClass){
            btnBurgerStyle.push("active");
            headerStyle.push("active");
            breadCrumbsStyle.push("active");
        }

        if(this.state.addMobileMenuClass){
            switch(this.state.addMobileHeader){
                case "departmentsLink":
                    mobileDepartmentMenu.push("open")
                break;

                case "myTeamSiteLink":
                    mobileMyTeamSiteMenu.push("open")
                break;
            }
            
        }

        // const newHeight = this.state.hover?200:0;
        return (
            // <div className={styles.header}>
            //     <div className={styles["header--primary"]}>
            //         <div className={styles.nav}>
            //             <ul className={styles["primary-nav"]} >
            //                 {this.state.terms.map(term=>{
            //                     return <li><span><a onMouseMove={this.mouseEnter} href={term.LocalCustomProperties._Sys_Nav_SimpleLinkUrl}>{term.Name}</a></span></li>
            //                 })}
            //             </ul>
            //         </div>
            //     </div>
            //     <div className={styles.header__curtain}></div>
            // </div>

            <div>
            {/* deleted wrapper */}
            <div className="">
            <header className={headerStyle.join(' ')} role="banner" >
                <div className="container-alt">
                    {/* need to add onclick function */}
                    <img src="https://evocate.sharepoint.com/sites/Sandbox/Test1/SiteAssets/image/logo-secondary.png" className="logo paddingLeft0" />
                    <a onClick={this.openMobileNav.bind(this)} className={btnBurgerStyle.join(' ')}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </a>
                    <nav className="nav" role="navigation">
                        {/* ul need to add */}
                        <ul className={breadCrumbsStyle.join(' ')} >

                            {/* <li onMouseEnter={this.changeHeightClass.bind(this)} onMouseLeave={this.changeHeightClass.bind(this)}> */}
                            <li>
                                <div className="underline">
                                <span>
                                    <a href="#">Home</a>
                                </span>
                                </div>
                            </li>

                            <li>
                                <div className="underline">
                                <span>
                                    <a href="#">Fund Information</a>
                                </span>
                                </div>
                            </li>

                            {/* <li onMouseEnter={this.changeHeightClass.bind(this)} onMouseLeave={this.changeHeightClass.bind(this)}> */}
                            <li onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} id="department">
                                    {/* {this.state.test.map(header=>{
                                        return <div className="underline"><span><a>{header.name}</a><ul><li><a></a></li></ul></span></div>
                                    })} */}
                                   <div className="underline">
                                    <span className={mobileDepartmentMenu.join(" ")}>
                                        <a href="#" onClick={this.openMobileMenu.bind(this)} id="departmentsLink">Departments</a>
                                        <ul>
                                            {/* needs the loop here */}
                                            {this.state.DepartmentchildrenItems.map(child=>{
                                                return <li><a href={child.path}>{child.name}</a></li>
                                            })}
                                        </ul>
                                    </span>
                                    </div>
                            </li>


                            {/* loop */}
                            {/* <li onMouseEnter={this.changeHeightClass.bind(this)} onMouseLeave={this.changeHeightClass.bind(this)}> */}
                            <li onMouseEnter={this.hoverOn.bind(this)} onMouseLeave={this.hoverOff.bind(this)} id="myteamsite">
                                {/* {this.state.test.map(header=>{
                                    return <div className="underline"><span><a>{header.name}</a><ul><li><a></a></li></ul></span></div>
                                })} */}
                                
                                <div className="underline">
                                <span className={mobileMyTeamSiteMenu.join(" ")}>
                                    <a href="#" onClick={this.openMobileMenu.bind(this)} id="myTeamSiteLink">My Team Site</a>
                                    <ul>
                                        {/* needs the loop here */}
                                        {this.state.MyTeamSitechildrenItems.map(child=>{
                                            return <li><a href={child.path}>{child.name}</a></li>
                                        })}
                                        {/* <li>
                                            <a href="http://m3property.1300efront.com/valuation/">Valuation</a>
                                        </li>
                                        <li>
                                            <a href="http://m3property.1300efront.com/asset-advisory/">Asset Advisory</a>
                                        </li>   
                                        <li>
                                            <a href="http://m3property.1300efront.com/litigation-and-acquisition/">Litigation + Acquisition</a>
                                        </li> */}
                                    </ul>
                                </span>
                                </div>
                            </li>

                            <li>
                                <div className="underline">
                                <span>
                                    <a href="#">Self Service</a>
                                </span>
                                </div>
                            </li>

                            <li>
                                <div className="underline">
                                <span>
                                    <a href="#">Community</a>
                                </span>
                                </div>
                            </li>
                            

                            {/* the space*/}
                            {/* <li>
                                <div>
                                <span>
                                    <a> </a>
                                </span>
                                </div>
                            </li> */}

                        </ul>


                    </nav>
                </div>
            <div  className="header__curtain" style={{height: newHeight+'px'}}></div>
                
            {/* <div  className={this.state.hover?"header__curtainWithHeight":"header__curtain"}></div> */}
                
            {/* <div className={header__curtain}></div> */}
            </header>
            </div>
            </div>
        )
    }


    // Clean Guid in the returing object
    public getGuid(value){
        var newValue = value.replace("/Guid(","");
        newValue = newValue.replace(")/","");

        return newValue;
    }

    public componentWillMount()
    {
        //console.log("mission id",ConfigService.getItemByName("Navigation").id);

        this.setState({test:ConfigService.getItems()});


        


        taxonomy.getDefaultSiteCollectionTermStore()
        .getTermSetById(ConfigService.getItemByName("Navigation").id).terms
        .get().then(
            Allterms=>{
                Allterms;
                console.log(Allterms)
                this.setState({terms:Allterms})
                this.passItems(Allterms);
                {Allterms.map(term=>{
                    term.Id=this.getGuid(term.Id);
                    console.log("term Name:",term.Name);
                    console.log("term Name:",term.LocalCustomProperties._Sys_Nav_SimpleLinkUrl);
                    
                })}
            }
        );

        // taxonomy.getDefaultSiteCollectionTermStore()
        // .getTermSetById(this.props.terSetId)
        // .terms.get().then(
        //     Allterms=>{
        //         console.log(Allterms);
        //         this.setState({terms:Allterms})




                // {Allterms.map(term=>{
                //     console.log(term.TermsCount);
                // })}
                // for(let i=0;i<Allterms.length;i++){
                //     if(Allterms.filter((e) => e.TermsCount===this.state.value)){
                //         console.log(this.state.value)
                //     }
                // }
            // }
        // )
    }
}


export const mouseEvents=()=>{
    const ele = document.getElementById('');
}