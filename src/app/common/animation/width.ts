import { trigger, animate, style, group, query, transition, animateChild, AnimationMetadata } from '@angular/animations';

export const widthTransition =

trigger('widthTransition', [
    transition(':enter', [
        /* query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }), */
        style({width: '0%' }),
        animate('200ms', style({ width: '100%'}))
    ]),
    transition(':leave', [
        /* query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }), */
        style({width: '100%'}),
        animate('200ms', style({ width: '0%'}))
    ]),
])